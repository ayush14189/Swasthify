import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Image,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  useToast,
  Grid,
  GridItem,
  Flex,
  VStack,
  Divider,
  Heading,
  Badge,
} from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BookAppointments = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [reason, setReason] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Fetch all available doctors on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/appointments/doctors');
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        toast({
          title: 'Error fetching doctors',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom-right',
        });
      }
    };

    fetchDoctors();
  }, [toast]);

  // Handle selecting the doctor and opening the modal
  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    onOpen();
  };

  // Submit the appointment form
  const handleSubmit = async () => {
    if (!selectedDoctor || !appointmentDate || !reason) {
      return toast({
        title: 'Please fill all fields',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom-right',
      });
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const patientId = user.userId;

      const requestBody = {
        patient_id: patientId,
        doctor_id: selectedDoctor._id,
        appointmentDate,
        reason,
      };

      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Appointment Requested',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'bottom-right',
        });
        onClose();
      } else {
        throw new Error(data.message || 'Failed to book appointment');
      }
    } catch (error) {
      toast({
        title: 'Error booking appointment',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-right',
      });
    }
  };

  return (
    <Box p={6} bg="gray.50">
      <Heading fontSize="4xl" fontWeight="extrabold" mb={6} textAlign="center" color="blue.700">
        Find Your Doctor
      </Heading>

      {/* Grid to display doctor cards */}
      <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
        {doctors.map((doctor) => (
          <GridItem key={doctor._id} onClick={() => handleSelectDoctor(doctor)}>
            <Box
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              p={4}
              boxShadow="lg"
              _hover={{ transform: 'scale(1.05)', transition: '0.3s', cursor: 'pointer' }}
              textAlign="center"
              bg="white"
            >
              <Image
                borderRadius="full"
                boxSize="150px"
                src={doctor.profileImage}
                alt={doctor.name}
                mx="auto"
              />
              <Text fontWeight="bold" fontSize="xl" mt={4} color="blue.700">
                {doctor.name}
              </Text>
              <Text mt={2} color="gray.600" fontSize="lg">
                {doctor.specialization}
              </Text>
              <Text color="gray.500">{doctor.yearsOfExperience}+ Years of Experience</Text>
              <Badge mt={2} colorScheme="green" fontSize="sm" p={1}>
                {doctor.qualifications}
              </Badge>
            </Box>
          </GridItem>
        ))}
      </Grid>

      {/* Modal for displaying doctor details and booking appointment */}
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction={{ base: 'column', md: 'row' }} p={4} gap={4}>
              {/* Doctor Details Section */}
              <VStack flex="2" align="start" spacing={4} bg="gray.50" p={4} borderRadius="md">
                <Image
                  borderRadius="full"
                  boxSize="120px"
                  src={selectedDoctor?.profileImage}
                  alt={selectedDoctor?.name}
                />
                <Box>
                  <Text fontSize="2xl" fontWeight="bold" color="blue.700">
                    {selectedDoctor?.name}
                  </Text>
                  <Text fontSize="lg" color="gray.500" mb={2}>
                    {selectedDoctor?.specialization}
                  </Text>
                  <Text fontSize="md" color="gray.600" mb={2}>
                    {selectedDoctor?.bio}
                  </Text>
                  <Divider />
                  <Text fontSize="lg" fontWeight="semibold" mt={4} color="blue.600">
                    Experience & Qualifications:
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    {selectedDoctor?.yearsOfExperience}+ Years of Experience
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    Hospitals: {selectedDoctor?.hospitals?.join(', ')}
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    Awards: {selectedDoctor?.awards?.join(', ')}
                  </Text>
                  <Text fontSize="md" color="gray.600" mt={2}>
                    Education:
                  </Text>
                  {selectedDoctor?.colleges?.map((college, index) => (
                    <Text key={index} fontSize="sm" color="blue.800">
                      {college.degree} - {college.name}
                    </Text>
                  ))}
                  <Text fontSize="md" color="gray.600">
                    Languages Spoken: {selectedDoctor?.languagesSpoken?.join(', ')}
                  </Text>
                  <Text fontSize="lg" fontWeight="semibold" mt={4} color="blue.600">
                    Other Details:
                  </Text>
                  <Text fontSize="md" color="green.600">
                    Consultation Fee: INR{selectedDoctor?.consultationFee}
                  </Text>
                  <Text fontSize="md" color="red.600">
                    Availability: {selectedDoctor?.availability}
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    Phone: {selectedDoctor?.phone}
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    Address: {selectedDoctor?.clinicAddress}
                  </Text>
                </Box>
              </VStack>

              {/* Appointment Booking Form Section */}
              <VStack flex="1" align="start" spacing={4} p={4}>
                <FormControl isRequired>
                  <FormLabel fontWeight="semibold" color="blue.700">Appointment Date</FormLabel>
                  <DatePicker
                    selected={appointmentDate}
                    onChange={(date) => setAppointmentDate(date)}
                    minDate={new Date()}
                    inline
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontWeight="semibold" color="blue.700">Reason</FormLabel>
                  <Textarea
                    placeholder="Reason for appointment"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    bg="gray.50"
                    _hover={{ bg: "gray.100" }}
                  />
                </FormControl>
                <Button colorScheme="blue" width="full" onClick={handleSubmit}>
                  Book Appointment
                </Button>
              </VStack>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default BookAppointments;
