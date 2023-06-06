import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    Heading,
    Flex,
    ModalCloseButton,
    Input,
    Box,
    Popover,
    PopoverTrigger,
    PopoverContent,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState, useRef } from "react";
import Cropper from "react-easy-crop";

export default function PostsForm({
    loggedInUser,
    modalIsOpen,
    setModalIsOpen,
}: any) {
    const router = useRouter();

    const handleModalClose = () => {
        setModalIsOpen(false);
        setSelectedImages([]);
        setPreview({ url: "", type: "" })
        setPreviewIndex(0)
        setCropValues([])
        setZoomValues([])
        setAspectRatio(undefined)
    };

    const cancelAlertRef: any = useRef();
    const [alertIsOpen, setAlertIsOpen] = useState(true);

    const [preview, setPreview] = useState<any>({ url: "", type: "" });
    const [previewIndex, setPreviewIndex] = useState<any>(0);
    const [cropValues, setCropValues] = useState([]);
    const [zoom, setZoom] = useState(1);
    const [zoomValues, setZoomValues] = useState([]);
    const [aspectRatio, setAspectRatio] = useState<undefined | number>(
        undefined
    );

    const [selectedImages, setSelectedImages] = useState<any>([]);
    const [desc, setDesc] = useState<string>("");

    const handleZoomChange = (event: any, imageIndex: number) => {
        const newZoomValues: any = [...zoomValues];
        newZoomValues[imageIndex] = parseFloat(event.target.value);
        setZoomValues(newZoomValues);
        setZoom(newZoomValues[imageIndex]);
    };

    const handleCropChange = (imageIndex: number, croppedArea: any) => {
        const newCropValues: any = [...cropValues];
        newCropValues[imageIndex] = { x: croppedArea.x, y: croppedArea.y };
        setCropValues(newCropValues);
    };

    const previewFile = useCallback(
        (file: File) => {
            const fileReader = new FileReader();

            fileReader.onload = function (event) {
                setPreview({
                    ...preview,
                    url: event.target?.result,
                    type: file.type.match(/image.*/) ? "image" : "video",
                });
            };

            fileReader.readAsDataURL(file);
        },
        [preview]
    );

    const handleImagesChange = (e: any) => {
        setSelectedImages(e.target.files);
        previewFile(e.target.files[0]);
    };

    const handleDescChange = (e: any) => {
        setDesc(e.target.value);
    };

    const handleImagesUpload = (e: any) => {
        if (selectedImages) {
            const formData = new FormData();
            for (var i = 0; i < selectedImages.length; i++) {
                formData.append("image" + (i + 1), selectedImages[i]);
            }

            formData.append("loggedInUserId", loggedInUser.id);
            formData.append("description", desc);
            formData.append("uploadPreset", "Instagram-Clone-Posts");

            axios({
                method: "POST",
                url: "/api/posts",
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }).then(() => router.reload());
        }
    };

    useEffect(() => {
        if (selectedImages.length > 0) {
            setZoom(zoomValues[previewIndex] || 1);
            previewFile(selectedImages[previewIndex]);
        }
    }, [selectedImages, previewIndex, previewFile, zoomValues]);

    return (
        <>
            <Modal
                isOpen={modalIsOpen}
                onClose={() => setAlertIsOpen(true)}
                size="lg"
                isCentered
            >
                <ModalOverlay backgroundColor="blackAlpha.700" />
                <ModalContent borderRadius={10}>
                    <ModalCloseButton />
                    {selectedImages.length === 0 && (
                        <Flex flexDir="column">
                            <Heading
                                size="sm"
                                fontWeight="medium"
                                py={3}
                                borderBottom="1px"
                                borderColor="gray.300"
                                textAlign="center"
                            >
                                Créer une nouvelle publication
                            </Heading>
                            <Flex
                                height={500}
                                position="relative"
                                justifyContent="center"
                                alignItems="center"
                                flexDir="column"
                                gap={5}
                            >
                                <svg
                                    aria-label="Icône pour représenter le contenu multimédia, comme les images ou les vidéos"
                                    className="x1lliihq x1n2onr6"
                                    color="rgb(0, 0, 0)"
                                    fill="rgb(0, 0, 0)"
                                    height="77"
                                    role="img"
                                    viewBox="0 0 97.6 77.3"
                                    width="96"
                                >
                                    <path
                                        d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z"
                                        fill="currentColor"
                                    ></path>
                                    <path
                                        d="M84.7 18.4 58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z"
                                        fill="currentColor"
                                    ></path>
                                    <path
                                        d="M78.2 41.6 61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z"
                                        fill="currentColor"
                                    ></path>
                                </svg>
                                <form>
                                    <Button
                                        size="sm"
                                        colorScheme="twitter"
                                        cursor="pointer"
                                    >
                                        {"Sélectionner sur l'ordinateur"}
                                        <Input
                                            type="file"
                                            multiple
                                            accept="image/*, video/*"
                                            onChange={handleImagesChange}
                                            position="absolute"
                                            opacity={0}
                                        />
                                    </Button>
                                </form>
                            </Flex>
                        </Flex>
                    )}
                    {/* /////////// */}
                    {selectedImages.length > 0 && (
                        <Flex flexDir="column">
                            <Heading
                                size="sm"
                                fontWeight="medium"
                                py={3}
                                borderBottom="1px"
                                borderColor="gray.300"
                                textAlign="center"
                            >
                                Rogner
                            </Heading>
                            <Flex
                                height={500}
                                position="relative"
                                justifyContent="center"
                                alignItems="center"
                                flexDir="column"
                                gap={5}
                                borderRadius={10}
                            >
                                <Popover placement="top">
                                    <PopoverTrigger>
                                        <Button
                                            position="absolute"
                                            bottom={2}
                                            left={2}
                                            zIndex={2}
                                            borderRadius="50%"
                                            padding={0}
                                            backgroundColor="black"
                                            size="sm"
                                            opacity={0.8}
                                            _hover={{
                                                color: "black",
                                                opacity: 0.5,
                                            }}
                                        >
                                            <i
                                                className="fa-light fa-crop-simple"
                                                style={{
                                                    zIndex: 2,
                                                    color: "white",
                                                }}
                                            ></i>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        w="max-content"
                                        border="none"
                                        // opacity=".6 !important"
                                        borderRadius={10}
                                        backgroundColor="transparent"
                                    >
                                        <Flex
                                            flexDir="column"
                                            w="max-content"
                                            backgroundColor="rgba(0,0,0,.6)"
                                            borderRadius={10}
                                        >
                                            <Box
                                                borderBottom="1px"
                                                borderColor="gray.300"
                                                onClick={() => {
                                                    setAspectRatio(undefined);
                                                }}
                                                padding={1}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    gap={2}
                                                    color="white"
                                                    backgroundColor="transparent"
                                                    _hover={{
                                                        backgroundColor:
                                                            "transparent",
                                                    }}
                                                    fontSize=".9em"
                                                    fontWeight="normal"
                                                    opacity={
                                                        aspectRatio ===
                                                        undefined
                                                            ? 1
                                                            : 0.4
                                                    }
                                                >
                                                    Original
                                                    <i
                                                        className="fa-regular fa-image"
                                                        style={{
                                                            fontSize: "1.4em",
                                                        }}
                                                    ></i>
                                                </Button>
                                            </Box>
                                            <Box
                                                borderBottom="1px"
                                                borderColor="gray.300"
                                                onClick={() => {
                                                    setAspectRatio(1 / 1);
                                                }}
                                                padding={1}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    gap={2}
                                                    color="white"
                                                    backgroundColor="transparent"
                                                    _hover={{
                                                        backgroundColor:
                                                            "transparent",
                                                    }}
                                                    fontSize=".9em"
                                                    fontWeight="normal"
                                                    opacity={
                                                        aspectRatio === 1 / 1
                                                            ? 1
                                                            : 0.4
                                                    }
                                                >
                                                    1:1
                                                    <i
                                                        className="fa-regular fa-square"
                                                        style={{
                                                            fontSize: "1.4em",
                                                        }}
                                                    ></i>
                                                </Button>
                                            </Box>
                                            <Box
                                                borderBottom="1px"
                                                borderColor="gray.300"
                                                onClick={() => {
                                                    setAspectRatio(4 / 5);
                                                }}
                                                padding={1}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    gap={2}
                                                    color="white"
                                                    backgroundColor="transparent"
                                                    _hover={{
                                                        backgroundColor:
                                                            "transparent",
                                                    }}
                                                    fontSize=".9em"
                                                    fontWeight="normal"
                                                    opacity={
                                                        aspectRatio === 4 / 5
                                                            ? 1
                                                            : 0.4
                                                    }
                                                >
                                                    4:5
                                                    <i
                                                        className="fa-regular fa-rectangle-vertical"
                                                        style={{
                                                            fontSize: "1.4em",
                                                        }}
                                                    ></i>
                                                </Button>
                                            </Box>
                                            <Box
                                                onClick={() => {
                                                    setAspectRatio(16 / 9);
                                                }}
                                                padding={1}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    gap={2}
                                                    color="white"
                                                    backgroundColor="transparent"
                                                    _hover={{
                                                        backgroundColor:
                                                            "transparent",
                                                    }}
                                                    fontSize=".9em"
                                                    fontWeight="normal"
                                                    opacity={
                                                        aspectRatio === 16 / 9
                                                            ? 1
                                                            : 0.4
                                                    }
                                                >
                                                    16:9
                                                    <i
                                                        className="fa-regular fa-rectangle-wide"
                                                        style={{
                                                            fontSize: "1.4em",
                                                        }}
                                                    ></i>
                                                </Button>
                                            </Box>
                                        </Flex>
                                    </PopoverContent>
                                </Popover>
                                <Popover placement="top">
                                    <PopoverTrigger>
                                        <Button
                                            position="absolute"
                                            bottom={2}
                                            left={14}
                                            zIndex={2}
                                            borderRadius="50%"
                                            padding={0}
                                            backgroundColor="black"
                                            size="sm"
                                            opacity={0.8}
                                            _hover={{
                                                color: "black",
                                                opacity: 0.5,
                                            }}
                                        >
                                            <i
                                                className="fa-light fa-magnifying-glass"
                                                style={{
                                                    zIndex: 2,
                                                    color: "white",
                                                }}
                                            ></i>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        border="none"
                                        width={150}
                                        borderRadius={6}
                                        backgroundColor="transparent"
                                    >
                                        <Flex
                                            padding={4}
                                            backgroundColor="rgba(0, 0, 0, .6)"
                                            borderRadius={6}
                                        >
                                            <Input
                                                type="range"
                                                min={1}
                                                max={3}
                                                value={
                                                    zoomValues[previewIndex] ||
                                                    1
                                                }
                                                step={0.1}
                                                backgroundColor="white"
                                                height="1px"
                                                padding={0}
                                                border="none"
                                                outline="none"
                                                onChange={(e) =>
                                                    handleZoomChange(
                                                        e,
                                                        previewIndex
                                                    )
                                                }
                                            />
                                        </Flex>
                                    </PopoverContent>
                                </Popover>
                                <Popover>
                                    <PopoverTrigger>
                                        <Button
                                            position="absolute"
                                            bottom={2}
                                            right={2}
                                            zIndex={2}
                                            borderRadius="50%"
                                            padding={0}
                                            backgroundColor="black"
                                            size="sm"
                                            opacity={0.8}
                                            _hover={{
                                                color: "black",
                                                opacity: 0.5,
                                            }}
                                        >
                                            <i
                                                className="fa-light fa-clone"
                                                style={{
                                                    zIndex: 2,
                                                    color: "white",
                                                }}
                                            ></i>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent></PopoverContent>
                                </Popover>
                                <Cropper
                                    image={
                                        preview.type === "image"
                                            ? preview.url
                                            : undefined
                                    }
                                    video={
                                        preview.type === "video"
                                            ? preview.url
                                            : undefined
                                    }
                                    crop={
                                        cropValues[previewIndex] || {
                                            x: 0,
                                            y: 0,
                                        }
                                    }
                                    zoom={zoom}
                                    onCropChange={(croppedArea) =>
                                        handleCropChange(
                                            previewIndex,
                                            croppedArea
                                        )
                                    }
                                    onZoomChange={setZoom}
                                    aspect={aspectRatio}
                                    objectFit={"horizontal-cover"}
                                    style={{
                                        containerStyle: {
                                            borderRadius: "0 0 10px 10px",
                                        },
                                    }}
                                />
                                {previewIndex > 0 && (
                                    <Button
                                        position="absolute"
                                        bottom="50%"
                                        transform="translateY(50%)"
                                        left={2}
                                        zIndex={2}
                                        borderRadius="50%"
                                        padding={0}
                                        backgroundColor="black"
                                        size="sm"
                                        opacity={0.8}
                                        _hover={{
                                            color: "black",
                                            opacity: 0.5,
                                        }}
                                        onClick={() => {
                                            setPreviewIndex(previewIndex - 1);
                                        }}
                                    >
                                        <i
                                            className="fa-light fa-chevron-left"
                                            style={{
                                                zIndex: 2,
                                                color: "white",
                                            }}
                                        ></i>
                                    </Button>
                                )}
                                {previewIndex < selectedImages.length - 1 && (
                                    <Button
                                        position="absolute"
                                        bottom="50%"
                                        transform="translateY(50%)"
                                        right={2}
                                        zIndex={2}
                                        borderRadius="50%"
                                        padding={0}
                                        backgroundColor="black"
                                        size="sm"
                                        opacity={0.8}
                                        _hover={{
                                            color: "black",
                                            opacity: 0.5,
                                        }}
                                        onClick={() => {
                                            setPreviewIndex(previewIndex + 1);
                                        }}
                                    >
                                        <i
                                            className="fa-light fa-chevron-right"
                                            style={{
                                                zIndex: 2,
                                                color: "white",
                                            }}
                                        ></i>
                                    </Button>
                                )}
                            </Flex>
                        </Flex>
                    )}
                </ModalContent>
            </Modal>
            <AlertDialog
                isOpen={alertIsOpen}
                onClose={() => setAlertIsOpen(false)}
                leastDestructiveRef={cancelAlertRef}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent borderRadius={12}>
                        <Flex flexDir="column" justifyContent="center">
                            <Box
                                textAlign="center"
                                py={7}
                                borderBottom="1px"
                                borderColor="blackAlpha.300"
                            >
                                <Text fontSize="xl" fontWeight="normal">
                                    Abandonner la publication ?
                                </Text>
                                <Text fontSize="sm" color="blackAlpha.600">
                                    Si vous quittez la publication, vos
                                    modifications ne seront pas enregistrées.
                                </Text>
                            </Box>
                            <Box
                                borderBottom="1px"
                                textAlign="center"
                                borderColor="blackAlpha.300"
                            >
                                <Button
                                    _hover={{
                                        opacity: 0.5,
                                        backgroundColor: "transparent",
                                    }}
                                    size="lg"
                                    fontSize="sm"
                                    variant="ghost"
                                    color="red.400"
                                    fontWeight="bold"
                                    w="full"
                                    onClick={() => {
                                        handleModalClose()
                                        setAlertIsOpen(false);
                                    }}
                                >
                                    Abandonner
                                </Button>
                            </Box>
                            <Box textAlign="center">
                                <Button
                                    _hover={{
                                        opacity: 0.5,
                                        backgroundColor: "transparent",
                                    }}
                                    size="lg"
                                    fontSize="sm"
                                    variant="ghost"
                                    w="full"
                                    ref={cancelAlertRef}
                                    onClick={() => setAlertIsOpen(false)}
                                >
                                    Annuler
                                </Button>
                            </Box>
                        </Flex>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
            {/* ///////////////////// */}
            {/* <div>
                <Heading size="md">Créer une nouvelle publication</Heading>
                <form>
                    <Input type="file" multiple onChange={handleImagesChange} />
                    <Textarea
                        placeholder="Entrez une légende"
                        onChange={handleDescChange}
                    />
                    <Button onClick={handleImagesUpload}>Publier</Button>
                </form>
            </div> */}
        </>
    );
}
