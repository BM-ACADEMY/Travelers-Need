import React, { useEffect, useState } from "react";
import { useComponentName } from "../../../../hooks/ComponentnameContext";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import Step1 from "./TourPlanStepper/Step1";
import Step2 from "./TourPlanStepper/Step2";
import Step3 from "./TourPlanStepper/Step3";
import Step4 from "./TourPlanStepper/Step4";
import TourPlansTable from "./table/TourPlansTable";
import AlertMessage from "../../reusableComponents/AlertMessage";
import {
  fetchAllAddressForPlaces,
  fetchAllThemesForTourPlans,
  fetchAllCitesForTourPlans,
  fetchSubCitiesByCityname,
  createTourPlan,
  updateTourPlan,
} from "../../services/ApiService";
const TourPackages = () => {
  const { setComponentName } = useComponentName();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tourCode: "",
    title: "",
    itSummaryTitle: "",
    addressId: "",
    startPlace: "",
    endPlace: "",
    duration: "",
    baseFare: "",
    origFare: "",
    tourType: "",
    enableIcons: "N",
    itPopular: "N",
    itTop: "N",
    itTourPlan: "N",
    itinerary: [],
    inclusions: [],
    exclusions: [],
    optional: [],
    themeId: [],
    images: [],
  });
  const [addressOptions, setAddressOptions] = useState([]);
  const [TourPlanId, setTourPlanId] = useState("");
  const [error, setError] = useState(null);
  const [cityOptions, setCityOptions] = useState([]);
  const [subCityOptions, setSubCityOptions] = useState([]);
  const [themesOptions, setThemesOptions] = useState([]);
  const [successMessage, setSuccessMessage] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const steps = [
    "Basic Details",
    "Itinerary",
    "Inclusions/Exclusions",
    "Review & Submit",
  ];
  useEffect(() => {
    setComponentName("Tour Packages");
  }, [setComponentName]);
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true); // Start loading
        const response = await fetchAllAddressForPlaces();
        setAddressOptions(response.data.cities); // Assuming the data is an array of addresses
        setLoading(false); // Stop loading
      } catch (err) {
        console.error("Error fetching addresses:", err);
        setError(err.message || "An error occurred");
        setLoading(false); // Stop loading
      }
    };

    fetchAddresses();
  }, []);
  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await fetchAllThemesForTourPlans();
        setThemesOptions(response.data.themes);
      } catch (error) {
        console.error("Error fetching themes:", error);
      }
    };

    fetchThemes();
  }, []);
  const handleFormDataChange = (newData) => {
    setFormData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const response = await fetchAllCitesForTourPlans();
        setCityOptions(response.data.data); // Assuming response structure
        setLoading(false);
      } catch (err) {
        console.error("Error fetching cities:", err);
        setError(err.message || "An error occurred");
        setLoading(false);
      }
    };

    fetchCities();
  }, []);
  async function urlToFile(url, filename) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  }
  const fetchSubCities = async (cityName) => {
    if (!cityName) console.log("cityname is empty");
    try {
      setLoading(true);
      const response = await fetchSubCitiesByCityname(cityName);
      setLoading(false);
      // return Array.isArray(response.data.data) ? response.data.data : [];
      setSubCityOptions(response.data.data);
    } catch (err) {
      console.error("Error fetching sub-cities:", err);
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);

    const formDataPayload = new FormData();

    // Append scalar fields
    formDataPayload.append("tourCode", formData.tourCode);
    formDataPayload.append("title", formData.title);
    formDataPayload.append("itSummaryTitle", formData.itSummaryTitle);
    formDataPayload.append("addressId", formData.addressId);
    formDataPayload.append("startPlace", formData.startPlace);
    formDataPayload.append("endPlace", formData.endPlace);
    formDataPayload.append("duration", formData.duration);
    formDataPayload.append("baseFare", formData.baseFare);
    formDataPayload.append("origFare", formData.origFare);
    formDataPayload.append("tourType", formData.tourType);
    formDataPayload.append("enableIcons", formData.enableIcons);
    formDataPayload.append("itPopular", formData.itPopular);
    formDataPayload.append("itTop", formData.itTop);
    formDataPayload.append("itTourPlan", formData.itTourPlan);

    // Append itinerary array
    if (formData.itinerary && formData.itinerary.length > 0) {
      for (const item of formData.itinerary) {
        const itineraryItem = {
          day: item.day,
          title: item.title,
          activities: item.activities,
          places: item.places,
          startTime: item.startTime,
          endTime: item.endTime,
        };
        formDataPayload.append("itinerary[]", JSON.stringify(itineraryItem));
      }
    }

    // Append inclusions, exclusions, optional, and themeId
    formDataPayload.append("inclusions", JSON.stringify(formData.inclusions));
    formDataPayload.append("exclusions", JSON.stringify(formData.exclusions));
    formDataPayload.append("optional", JSON.stringify(formData.optional));
    formDataPayload.append("themeId", JSON.stringify(formData.themeId));

    // Append images
    if (formData.images && formData.images.length > 0) {
      for (const image of formData.images) {
        if (typeof image === "string" && image.startsWith("blob:")) {
          // Convert blob URL to File
          const file = await urlToFile(image, "image.jpg"); // Replace with appropriate filename
          formDataPayload.append("images", file);
        } else {
          // Append the image directly if it's already a File object
          formDataPayload.append("images", image);
        }
      }
    }

    try {
      // Submit API call
      setStatus("");
      setMessage("");
      setShowAlert(false);
      console.log("Submitting Data: ", formDataPayload);
      const response = await createTourPlan(formDataPayload);
      if (response && response.status === 201) {
        setSuccessMessage(true);
        setStatus("success");
        setMessage("TourPlan Created successfully!");
        setShowAlert(true); // Show success alert
      } else {
        setStatus("error");
        setMessage("Failed to save TourPlan!");
        setShowAlert(true); // Show error alert
      }
    } catch (error) {
      console.error("Error during submission", error);
      setStatus("error", error);
      setMessage("Something went wrong!");
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (tourPlan) => {
    setInitialData(tourPlan);
    console.log(tourPlan, "tourPlan data");
    setTourPlanId(tourPlan._id);
    // Prepare images array
    const images = [];
    if (tourPlan.images && tourPlan.images.length > 0) {
      for (const imageUrl of tourPlan.images) {
        images.push(imageUrl); // Add image URLs directly; convert to File if needed
      }
    }
    console.log(images, "image copy");

    // Patch the fields from `tourPlan` to `formData`
    setFormData({
      tourCode: tourPlan.tourCode || "",
      title: tourPlan.title || "",
      itSummaryTitle: tourPlan.itSummaryTitle || "",
      addressId: tourPlan.addressId._id || "",
      startPlace: tourPlan.startPlace._id || "",
      endPlace: tourPlan.endPlace || "",
      duration: tourPlan.duration || "",
      baseFare: tourPlan.baseFare || "",
      origFare: tourPlan.origFare || "",
      tourType: tourPlan.tourType || "",
      enableIcons: tourPlan.enableIcons || "N",
      itPopular: tourPlan.itPopular || "N",
      itTop: tourPlan.itTop || "N",
      itTourPlan: tourPlan.itTourPlan || "N",
      itinerary: tourPlan.itinerary || [], // Ensure it's an array
      inclusions: tourPlan.inclusions || [], // Ensure it's an array
      exclusions: tourPlan.exclusions || [], // Ensure it's an array
      optional: tourPlan.optional || [], // Ensure it's an array
      themeId: tourPlan.themeId || [], // Ensure it's an array
      images: images, // Use the prepared images array
    });
    console.log(formData.images, "after");
  };

  const handleUpdate = async () => {
    setLoading(true);
    console.log(formData);

    const formDataPayload = new FormData();

    // Track changes to fields
    const changes = {}; // Object to track changed fields

    // Helper to append field to FormData if changed
    const appendIfChanged = (key, value) => {
      console.log(`Comparing ${key}:`, initialData[key], "with", value); // Debugging
      if (
        initialData &&
        initialData[key] !== undefined &&
        JSON.stringify(initialData[key]) !== JSON.stringify(value)
      ) {
        formDataPayload.append(key, value);
        changes[key] = value; // Track the change
      }
    };

    // Append scalar fields only if they have changed
    appendIfChanged("tourCode", formData.tourCode);
    appendIfChanged("title", formData.title);
    appendIfChanged("itSummaryTitle", formData.itSummaryTitle);
    appendIfChanged("addressId", formData.addressId);
    appendIfChanged("startPlace", formData.startPlace);
    appendIfChanged("endPlace", formData.endPlace);
    appendIfChanged("duration", formData.duration);
    appendIfChanged("baseFare", formData.baseFare);
    appendIfChanged("origFare", formData.origFare);
    appendIfChanged("tourType", formData.tourType);
    appendIfChanged("enableIcons", formData.enableIcons);
    appendIfChanged("itPopular", formData.itPopular);
    appendIfChanged("itTop", formData.itTop);
    appendIfChanged("itTourPlan", formData.itTourPlan);

    // Append itinerary array only if it has changed
    if (
      formData.itinerary &&
      JSON.stringify(formData.itinerary) !==
        JSON.stringify(initialData.itinerary)
    ) {
      for (const item of formData.itinerary) {
        const itineraryItem = {
          day: item.day,
          title: item.title,
          activities: item.activities,
          places: item.places,
          startTime: item.startTime,
          endTime: item.endTime,
        };
        formDataPayload.append("itinerary[]", JSON.stringify(itineraryItem));
      }
    }

    // Handle inclusions and exclusions as arrays
    const appendArrayIfChanged = (key, array) => {
      if (array && JSON.stringify(array) !== JSON.stringify(initialData[key])) {
        array.forEach((item) => {
          formDataPayload.append(`${key}[]`, item); // Append each item as separate element
        });
      }
    };

    // Append inclusions, exclusions, optional, and themeId if changed
    appendArrayIfChanged("inclusions", formData.inclusions);
    appendArrayIfChanged("exclusions", formData.exclusions);
    appendArrayIfChanged("optional", formData.optional);
    appendArrayIfChanged("themeId", formData.themeId);

    // Process images
    if (formData.images && formData.images.length > 0) {
      for (const image of formData.images) {
        if (typeof image === "string") {
          // Check if the URL is unchanged
          if (!initialData.images.includes(image)) {
            console.log("same");

            const file = await urlToFile(image, "image.jpg"); // Convert URL to File
            formDataPayload.append("images", file);
          }
        } else if (image instanceof File) {
          // New image added by the user
          console.log("new");

          formDataPayload.append("images", image);
        }
      }
    }

    try {
      // Submit API call
      setStatus("");
      setMessage("");
      setShowAlert(false);
      console.log("Submitting Data: ", formDataPayload);
      const response = await updateTourPlan(TourPlanId, formDataPayload);
      if (response && response.status === 201) {
        setSuccessMessage(true);
        setStatus("success");
        setMessage("TourPlan updated successfully!");
        setShowAlert(true); // Show success alert
      } else {
        setStatus("error");
        setMessage("Failed to Update TourPlan!");
        setShowAlert(true); // Show error alert
      }
    } catch (error) {
      console.error("Error during submission", error);
      setStatus("error", error);
      setMessage("Something went wrong!");
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const placeOptions = [
    { id: "1", name: "Place A" },
    { id: "2", name: "Place B" },
    { id: "3", name: "Place C" },
    // Add more places as needed
  ];

  return (
    <div className="container mt-4">
      {showAlert && (
        <AlertMessage type={status} message={message} show={showAlert} />
      )}
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {loading ? (
        <CircularProgress style={{ marginTop: 20 }} />
      ) : (
        <>
          {activeStep === 0 && (
            <Step1
              formData={formData}
              onFormDataChange={handleFormDataChange}
              addressOptions={addressOptions}
              startPlaceOptions={addressOptions}
              endPlaceOptions={addressOptions}
            />
          )}
          {activeStep === 1 && (
            <Step2
              formData={formData}
              onFormDataChange={handleFormDataChange}
            />
          )}
          {activeStep === 2 && (
            <Step3
              formData={formData}
              onFormDataChange={handleFormDataChange}
              themeOptions={themesOptions}
            />
          )}
          {activeStep === 3 && (
            <Step4
              formData={formData}
              onFormDataChange={handleFormDataChange}
              fetchSubCities={fetchSubCities}
              cityOptions={cityOptions}
              subCityOptions={subCityOptions}
            />
          )}

          <div style={{ marginTop: 20 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              style={{
                border: "2px solid #ef156c",
                color: "#ef156c",
                textTransform: "none",
                cursor: "pointer",
                marginRight: 10,
              }}
            >
              Back
            </Button>
            <Button
              onClick={
                activeStep === steps.length - 1
                  ? TourPlanId
                    ? handleUpdate
                    : handleSubmit
                  : handleNext
              }
              style={{
                backgroundColor: "#ef156c",
                textTransform: "none",
                color: "white",
                cursor: "pointer",
              }}
            >
              {activeStep === steps.length - 1
                ? TourPlanId
                  ? "Update"
                  : "Submit"
                : "Next"}
            </Button>
          </div>
        </>
      )}
      <hr />
      <div className="mt-3">
        <TourPlansTable
          onEditTourPlan={handleEdit} // Pass handleEdit as a prop to the child
          successMessage={successMessage}
        />
      </div>
    </div>
  );
};

export default TourPackages;
