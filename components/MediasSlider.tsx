import React, { useRef, useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import { AnyMxRecord } from "dns";

export default function MediasSlider({ medias }: any) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [muted, setMuted] = useState(true);
    const [paused, setPaused] = useState(false);
    const videoRef :any = useRef(null);

    function handlePlayVideo(){
        paused ? 
        videoRef.current.play() : 
        videoRef.current.pause()
        setPaused(!paused)
    }

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
            {medias.map((media: any, index: any) =>
                media.type.match(/image/) ? (
                    <img
                        key={index}
                        src={media.url}
                        style={{
                            width: "100%",
                            height: "auto",
                            display:
                                index === currentImageIndex
                                    ? "initial"
                                    : "none",
                        }}
                    />
                ) : (
                    <Box key={index}
                    style={{
                        display:
                            index === currentImageIndex
                                ? "initial"
                                : "none",
                    }}
                    >
                        <video
                            ref={videoRef}
                            autoPlay
                            loop
                            muted={muted}
                            onClick={handlePlayVideo}
                            style={{
                                width: "100%",
                                height: "auto",
                                display:
                                    index === currentImageIndex
                                        ? "initial"
                                        : "none",
                                cursor : "pointer"
                            }}
                        >
                            <source src={media.url} />
                        </video>
                        <Button
                            position="absolute"
                            right={5}
                            bottom={5}
                            zIndex={2}
                            borderRadius="50%"
                            padding={0}
                            backgroundColor="black"
                            size="xs"
                            opacity={0.8}
                            _hover={{
                                color: "black",
                                opacity: 0.5,
                            }}
                            onClick={() => setMuted(!muted)}
                        >
                            {muted ? (
                                <i
                                    className="fa-solid fa-volume-slash"
                                    style={{
                                        zIndex: 2,
                                        color: "white",
                                    }}
                                ></i>
                            ) : (
                                <i
                                    className="fa-solid fa-volume"
                                    style={{
                                        zIndex: 2,
                                        color: "white",
                                    }}
                                ></i>
                            )}
                        </Button>
                        {paused &&
                        <Button
                            position="absolute"
                            right="50%"
                            bottom="50%"
                            zIndex={2}
                            padding={0}
                            backgroundColor="transparent"
                            _hover={{ backgroundColor: "transparent" }}
                            opacity={0.8}
                            color="white"
                            transform="translate(50%, 50%)"
                        >
                            <i
                                className="fa-solid fa-play"
                                style={{ fontSize: "5em" }}
                            ></i>
                        </Button>
                        }
                    </Box>
                )
            )}
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
                            shadow="lg"
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
                            boxShadow="md"
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
