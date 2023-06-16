import React, { useState } from "react";
import { motion } from "framer-motion";
import { Box } from "@chakra-ui/react";

export default function MediasSlider({ medias }: any) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    function nextImage() {
        setCurrentImageIndex((prevIndex: any) => {
            if (prevIndex !== medias.length - 1) {
                return prevIndex + 1;
            } else {
                return medias.length - 1;
            }
        });
    }

    function prevImage() {
        setCurrentImageIndex((prevIndex) => {
            if (prevIndex !== 0) {
                return prevIndex - 1;
            } else {
                return 0;
            }
        });
    }

    return (
        <Box overflow="hidden" position="relative">
            {medias.map((media: any, index: any) => (
                <motion.img
                    key={index}
                    src={media.url}
                    alt={`Slider Image ${index}`}
                    exit={{ translateX: 300 }}
                    animate={{ translateX: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        width: "100%",
                        height: "auto",
                        display:
                            index === currentImageIndex ? "initial" : "none",
                    }}
                />
            ))}
            {medias.length > 1 && (
                <>
                    {currentImageIndex !== 0 && (
                        <Box
                            role="button"
                            onClick={prevImage}
                            position="absolute"
                            top="50%"
                            left={3}
                            transform="translateY(-50%)"
                            color="white"
                            opacity={0.7}
                            shadow="md"
                            borderRadius="50%"
                        >
                            <i className="fa-solid fa-circle-chevron-left fa-xl"></i>
                        </Box>
                    )}
                    {currentImageIndex !== medias.length - 1 && (
                        <Box
                            role="button"
                            onClick={nextImage}
                            position="absolute"
                            top="50%"
                            right={3}
                            transform="translateY(-50%)"
                            color="white"
                            opacity={0.7}
                            shadow="md"
                            borderRadius="50%"
                        >
                            <i className="fa-solid fa-circle-chevron-right fa-xl"></i>
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
}
