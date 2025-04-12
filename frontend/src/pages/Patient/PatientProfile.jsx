import { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useToast,
  Textarea,
} from "@chakra-ui/react";
import axios from "axios";

const PatientProfile = () => {
  const [patientProfile, setPatientProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({});
  const toast = useToast();
  const userId = JSON.parse(localStorage.getItem("user"))?.userId;

  useEffect(() => {
    if (userId) {
      fetchPatientProfile();
    }
  }, [userId]);

  const fetchPatientProfile = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/users/patients/getprofile/${userId}`);
      if (data.success) {
        setPatientProfile(data.data);
        setFormValues(data.data); // Set form values for editing
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to fetch profile",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if the name refers to emergencyContact or languagesSpoken
    if (name.startsWith("emergencyContact.")) {
      const fieldName = name.split(".")[1]; // Get the specific field name
      setFormValues((prev) => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [fieldName]: value,
        },
      }));
    } else if (name === "languagesSpoken") {
      // Handle the languages spoken input separately
      const languagesArray = value.split(",").map((lang) => lang.trim());
      setFormValues((prev) => ({
        ...prev,
        languagesSpoken: languagesArray,
      }));
    } else {
      setFormValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/users/patients/updateprofile/${userId}`, formValues);
      if (response.data.success) {
        toast({
          title: "Profile updated successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
        setPatientProfile(response.data.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to update profile",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  return (
    <Stack spacing={4} p={4}>
      {patientProfile ? (
        <>
          <FormControl isReadOnly={!isEditing}>
            <FormLabel>Name</FormLabel>
            <Input
              name="name"
              value={formValues.name || ""}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </FormControl>
          <FormControl isReadOnly={!isEditing}>
            <FormLabel>Age</FormLabel>
            <Input
              name="age"
              type="number"
              value={formValues.age || ""}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </FormControl>
          <FormControl isReadOnly={!isEditing}>
            <FormLabel>Gender</FormLabel>
            <Input
              name="gender"
              value={formValues.gender || ""}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </FormControl>
          <FormControl isReadOnly={!isEditing}>
            <FormLabel>Phone</FormLabel>
            <Input
              name="phone"
              value={formValues.phone || ""}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </FormControl>
          <FormControl isReadOnly={!isEditing}>
            <FormLabel>Address</FormLabel>
            <Textarea
              name="address"
              value={formValues.address || ""}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </FormControl>
          <FormControl isReadOnly={!isEditing}>
            <FormLabel>Date of Birth</FormLabel>
            <Input
              name="dateOfBirth"
              type="date"
              value={formValues.dateOfBirth ? formValues.dateOfBirth.split('T')[0] : ""}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </FormControl>
          <FormControl isReadOnly={!isEditing}>
            <FormLabel>Medical History</FormLabel>
            <Textarea
              name="medicalHistory"
              value={formValues.medicalHistory || ""}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </FormControl>
          <FormControl isReadOnly={!isEditing}>
            <FormLabel>Current Medications</FormLabel>
            <Textarea
              name="currentMedications"
              value={formValues.currentMedications || ""}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </FormControl>
          <FormControl isReadOnly={!isEditing}>
            <FormLabel>Allergies</FormLabel>
            <Textarea
              name="allergies"
              value={formValues.allergies || ""}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </FormControl>
          <FormControl isReadOnly={!isEditing}>
            <FormLabel>Emergency Contact Name</FormLabel>
            <Input
              name="emergencyContact.name"
              value={formValues.emergencyContact?.name || ""}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </FormControl>
          <FormControl isReadOnly={!isEditing}>
            <FormLabel>Emergency Contact Relationship</FormLabel>
            <Input
              name="emergencyContact.relationship"
              value={formValues.emergencyContact?.relationship || ""}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </FormControl>
          <FormControl isReadOnly={!isEditing}>
            <FormLabel>Emergency Contact Phone</FormLabel>
            <Input
              name="emergencyContact.phone"
              value={formValues.emergencyContact?.phone || ""}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </FormControl>
          <FormControl isReadOnly={!isEditing}>
            <FormLabel>Languages Spoken</FormLabel>
            <Input
              name="languagesSpoken"
              value={formValues.languagesSpoken?.join(", ") || ""}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </FormControl>
          
          {isEditing ? (
            <Button colorScheme="blue" onClick={handleSave}>
              Save
            </Button>
          ) : (
            <Button colorScheme="blue" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </Stack>
  );
};

export default PatientProfile;
