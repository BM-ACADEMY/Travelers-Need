import React, { useEffect } from "react";
import { useComponentName } from "../../hooks/ComponentnameContext";

const Dashboard = () => {
  const { setComponentName } = useComponentName();
  useEffect(() => {
    setComponentName("Dahboard");
  }, [setComponentName]);
  return <div>dashboard</div>;
};

export default Dashboard;
