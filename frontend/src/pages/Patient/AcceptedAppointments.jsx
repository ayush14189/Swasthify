import {
  Heading,
  Box,
  Image,
  Text,
  VStack,
  HStack,
  Stack,
  useToast,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FiEye, FiLink, FiPlus } from 'react-icons/fi';

const AcceptedAppointments = () => {
  const [populatedAppointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [reportImage, setReportImage] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Fetch patientId from local storage after successful login
  const patient = JSON.parse(localStorage.getItem('user'));
  const patientId = patient.userId;

  useEffect(() => {
    if (patientId) {
      fetchAcceptedAppointments();
    }
  }, [patientId]);

  
  const fetchAcceptedAppointments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/appointments/accepted/patient/${patientId}`
      );
      setAppointments(response.data);
    } catch (error) {
      toast({
        title: 'Error fetching appointments',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-right',
      });
    }
  };


  const openReportModal = (appointment) => {
    setSelectedAppointment(appointment);
    onOpen();
  };
      
  const openPrescriptionModal = (appointment) => {
    setSelectedAppointment(appointment);
    onOpen();
  };

  const openMeet = (meetLink) => {
    if (meetLink) {
      window.open(meetLink, '_blank');
    }
  };

  const addReport = (appointmentId) => {
    // Logic to add report for the given appointment
    toast({
      title: 'Feature to Add Report',
      description: `Add report for appointment ${appointmentId}`,
      status: 'info',
      duration: 3000,
      isClosable: true,
      position: 'bottom-right',
    });
  };

  return (
    <VStack spacing={5} align="stretch">
            <Heading fontSize="4xl" fontWeight="extrabold" mb={6} textAlign="center" color="blue.700">
        Your Appointments
      </Heading>
      {populatedAppointments.length === 0 ? (
        <Text>No accepted appointments found</Text>
      ) : (
        populatedAppointments.map((appointment) => (
          <Box
            key={appointment._id}
            bg="white"
            boxShadow="md"
            p={5}
            borderRadius="lg"
          >
            <HStack align="center" spacing={5}>
              {/* Doctor Image */}
              <Image
                borderRadius="full"
                boxSize="100px"
                src={appointment.doctorDetails?.profileImage} // Use real image URL from doctorDetails
                alt="Doctor Image"
              />

              {/* Middle Section with Doctor Details */}
              <Stack direction="column" spacing={1} flex={1}>
                {appointment.doctorDetails && (
                  <>
                    <Text fontWeight="bold">
                      {appointment.doctorDetails.name} ({appointment.doctorDetails.specialization})
                    </Text>
                    <Text>Appointment Date: {new Date(appointment.appointmentDate).toLocaleDateString()}</Text>
                    <Text>Appointment Time: {new Date(appointment.appointmentDate).toLocaleTimeString()}</Text>
                    <Text>Reason: {appointment.reason}</Text>
                  </>
                )}
              </Stack>

              {/* Action Buttons */}
              <HStack spacing={4}>
                {/* View Prescription Button */}
                <Button
                  leftIcon={<FiEye />}
                  size="sm"
                  variant="solid"
                  colorScheme="green"
                  onClick={() => openPrescriptionModal(appointment)}
                >
                  View Prescription
                </Button>

                {/* Add Report Button */}
                <Button
                  leftIcon={<FiPlus />}
                  size="sm"
                  variant="solid"
                  colorScheme="orange"
                  onClick={() => addReport(appointment._id)}
                >
                  Add Report
                </Button>

                {/* Join Meet Button (always present) */}
                <Button
                  leftIcon={<FiLink />}
                  size="sm"
                  variant="solid"
                  colorScheme="blue"
                  onClick={() => openMeet(appointment.meetLink)}
                  isDisabled={!appointment.meetLink}
                >
                  Join Meet
                </Button>
              </HStack>
            </HStack>
          </Box>
        ))
      )}

      {/* Prescription Modal */}
      <Modal size="4xl" isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent borderRadius="2xl" boxShadow="lg" bg="white" p={6}>
          <ModalHeader fontSize="2xl" fontWeight="bold">
            Prescription Details for {selectedAppointment?.doctorDetails?.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedAppointment?.summary?.length > 0 ? (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Medicine Name</Th>
                    <Th>Times per Day</Th>
                    <Th>Days</Th>
                    <Th>Purpose</Th>
                    <Th>Instructions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {selectedAppointment.summary.map((medicine, index) => (
                    <Tr key={index}>
                      <Td>{medicine.name}</Td>
                      <Td>{medicine.timesPerDay}</Td>
                      <Td>{medicine.days}</Td>
                      <Td>{medicine.purpose}</Td>
                      <Td>{medicine.instructions}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Text>No prescription details available.</Text>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default AcceptedAppointments;