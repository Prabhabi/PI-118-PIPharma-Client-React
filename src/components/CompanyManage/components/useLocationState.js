import { useReducer, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // Import Cookies

const initialState = {
  stateList: [],
  districtList: [],
  cityList: [],
  selectedState: "",
  selectedDistrict: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_STATE_LIST":
      return { ...state, stateList: action.payload };
    case "SET_DISTRICT_LIST":
      return { ...state, districtList: action.payload };
    case "SET_CITY_LIST":
      return { ...state, cityList: action.payload };
    case "SET_SELECTED_STATE":
      return { ...state, selectedState: action.payload, districtList: [], cityList: [] };
    case "SET_SELECTED_DISTRICT":
      return { ...state, selectedDistrict: action.payload, cityList: [] };
    default:
      return state;
  }
};

const useLocationState = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

  const fetchStateFn = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_URL}/api/state-master`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sanctumToken,
        },
      });
      dispatch({ type: "SET_STATE_LIST", payload: res.data });
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const fetchDistricts = async (stateId) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_URL}/api/districts/${stateId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sanctumToken,
        },
      });
      dispatch({ type: "SET_DISTRICT_LIST", payload: res.data.data });
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const fetchCities = async (districtId) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_URL}/api/cities/${districtId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sanctumToken,
        },
      });
      dispatch({ type: "SET_CITY_LIST", payload: res.data.data });
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  useEffect(() => {
    fetchStateFn();
  }, []);

  return {
    state,
    dispatch,
    fetchDistricts,
    fetchCities,
  };
};

export default useLocationState;
