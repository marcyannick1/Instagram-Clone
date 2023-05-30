import { Input, Textarea, Heading, Button } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";

export default function PostsForm({ loggedInUser }: any) {
    const router = useRouter();

    const [selectedImages, setSelectedImages] = useState<any>(null);
    const [desc, setDesc] = useState<string>("");

    const handleImagesChange = (e: any) => {
        setSelectedImages(e.target.files);
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

    return (
        <div>
            <Heading size="md">Créer une nouvelle publication</Heading>
            <form>
                <Input
                    type="file"
                    multiple
                    onChange={handleImagesChange}
                />
                <Textarea
                    placeholder="Entrez une légende"
                    onChange={handleDescChange}
                />
                <Button onClick={handleImagesUpload}>Publier</Button>
            </form>
        </div>
    );
}
