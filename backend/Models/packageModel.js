// const mongoose = require('mongoose');

// // Define the package schema
// const packageSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, 'Package name is required'],
//     },
//     themeId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Theme', // Reference to the Theme model
//       required: [true, 'Theme ID is required'],
//     },
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User', // Reference to the User model
//       required: [true, 'User ID is required'], // Ensures we know who added the package
//     },
//     price: {
//       type: Number,
//       required: [true, 'Price is required'],
//     },
//     duration: {
//       type: String,
//       required: [true, 'Duration is required'],
//     },
//     inclusions: {
//       type: [String],
//       default: [], // Optional field, defaults to an empty array
//     },
//     images: {
//       type: [String],
//       default: [], // Optional field, defaults to an empty array
//     },
//     packageDescription: {
//       type: String,
//       required: [true, 'Package description is required'],
//     },
//     categories: {
//       type: [String],
//       default: ["normal"], // Default value set to ["normal"]
//       enum: ["normal", "trending", "top destination"], // Restricts values to these options
//     },
//     addressId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Address', // Reference to the Address model
//       required: [true, 'Address ID is required'],
//     },
//     bestMonth: {
//       type: String,
//       required: [true, 'Best month is required'],
//       // validate: {
//       //   validator: function (value) {
//       //     // Regex to match format like "December, 2024"
//       //     return /^[A-Za-z]+,\s\d{4}$/.test(value);
//       //   },
//       //   message: 'Best month must be in the format "Month, YYYY"',
//       // },
//     },
//   },
//   { timestamps: true } // Automatically adds createdAt and updatedAt fields
// );

// // Create the Package model
// const Package = mongoose.model('Package', packageSchema);

// module.exports = Package;
const mongoose = require('mongoose');

// Define sub-schema for transport details
const transportSchema = new mongoose.Schema({
  mode: {
    type: String,
    required: [true, 'Transport mode is required'], // e.g., Train, Bus, Airport
  },
  origin: {
    type: String,
    required: [true, 'Origin is required'], // e.g., Chalakudy, Chennai
  },
  distance: {
    type: Number,
    required: [true, 'Distance is required'], // Distance in kilometers
  },
  frequency: {
    type: String,
    required: [true, 'Frequency is required'], // e.g., 15/Day
  },
  duration: {
    type: String,
    required: [true, 'Duration is required'], // e.g., 1 Hr 30 Mins
  },
});

// Define sub-schema for network settings
const networkSettingsSchema = new mongoose.Schema({
  internetAvailability: {
    type: String, // e.g., Good, Moderate, None
    default: 'Moderate',
  },
  stdCode: {
    type: String, // e.g., STD code of the location
  },
  languageSpoken: {
    type: [String], // e.g., [English, Hindi, Tamil]
    default: [],
  },
  majorFestivals: {
    type: [String], // e.g., [Diwali, Pongal]
    default: [],
  },
  notesOrTips: {
    type: String, // Additional information or tips
  },
});

// Define sub-schema for weather information
const weatherInfoSchema = new mongoose.Schema({
  minTemperature: {
    type: Number, // Minimum temperature in degrees
    required: [true, 'Minimum temperature is required'],
  },
  maxTemperature: {
    type: Number, // Maximum temperature in degrees
    required: [true, 'Maximum temperature is required'],
  },
  presentTemperature: {
    type: Number, // Current temperature in degrees
    required: [true, 'Present temperature is required'],
  },
  season: [
    {
      title: {
        type: String, // e.g., Summer, Winter, Monsoon
        required: [true, 'Season title is required'],
      },
      description: {
        type: String, // Description of the season
        required: [true, 'Season description is required'],
      },
    },
  ]
});

// Main Package Schema
const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Package name is required'],
    },
    themeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theme',
      required: [true, 'Theme ID is required'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    tripDuration: {
      type: String, // e.g., "3 Days, 2 Nights"
      required: [true, 'Trip duration is required'],
    },
    nearestCity: {
      type: String, // e.g., Kochi
    },
    bestToVisitCity: {
      type: String, // e.g., Munnar
    },
    peakSeason: {
      type: String, // e.g., December - January
    },
    packageDescription: {
      type: String,
      required: [true, 'Package description is required'],
    },
    networkSettings: networkSettingsSchema, // Embed network settings
    howToReach: [transportSchema], // Embed array of transport details
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
      required: [true, 'Address ID is required'],
    },
    bestTimeToVisit: weatherInfoSchema, // Embed weather information schema
    categories: {
      type: [String],
      default: ['normal'],
      enum: ['normal', 'trending', 'top destination'],
    },
    images: {
      type: [String],
      default: [],
    },
    inclusions: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create the Package model
const Package = mongoose.model('Package', packageSchema);

module.exports = Package;
