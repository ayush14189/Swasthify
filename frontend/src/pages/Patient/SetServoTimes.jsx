import React, { useState } from "react";
import {
  Container,
  Box,
  Heading,
  Input,
  Button,
  Text,
  VStack,
  HStack,
  useToast,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

const SetServoTimes = () => {
  const [time1, setTime1] = useState("");
  const [time2, setTime2] = useState("");
  const [time3, setTime3] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:7500/set_times", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ time1, time2, time3 }),
      });

      const data = await res.text();
      setResponse(data);

      toast({
        title: "Timestamps Saved",
        description: data,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setTime1("");
      setTime2("");
      setTime3("");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to save timestamps.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setResponse("Failed to save timestamps.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="lg" py={10}>
      <Box
        bg="white"
        boxShadow="md"
        borderRadius="xl"
        p={8}
        mx="auto"
        w="full"
        maxW="md"
      >
        <Heading
          as="h2"
          size="lg"
          textAlign="center"
          color="gray.700"
          mb={6}
          fontWeight="bold"
        >
          Set Time Slots
        </Heading>

        <VStack spacing={4} as="form" onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel color="gray.600">Time Slot 1</FormLabel>
            <Input
              type="time"
              value={time1}
              onChange={(e) => setTime1(e.target.value)}
              focusBorderColor="blue.500"
              borderRadius="full"
              p={3}
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel color="gray.600">Time Slot 2</FormLabel>
            <Input
              type="time"
              value={time2}
              onChange={(e) => setTime2(e.target.value)}
              focusBorderColor="blue.500"
              borderRadius="full"
              p={3}
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel color="gray.600">Time Slot 3</FormLabel>
            <Input
              type="time"
              value={time3}
              onChange={(e) => setTime3(e.target.value)}
              focusBorderColor="blue.500"
              borderRadius="full"
              p={3}
              required
            />
          </FormControl>
          <HStack spacing={4} w="full">
            <Button
              colorScheme="blue"
              type="submit"
              w="full"
              isLoading={loading}
              loadingText="Submitting"
              transition="transform 0.2s"
              _hover={{ transform: "scale(1.05)" }}
            >
              Submit
            </Button>
          </HStack>
        </VStack>

        {response && (
          <Text
            mt={4}
            textAlign="center"
            color={response.toLowerCase().includes("error") ? "red.500" : "green.500"}
            fontWeight="medium"
          >
            {response}
          </Text>
        )}
      </Box>
    </Container>
  );
};

export default SetServoTimes;