import { Container } from "../../../components/Container";
import { DashboardHeader } from "../../../components/PainelHeader";
import { FiUpload, FiTrash } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { Input } from "../../../components/Input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ChangeEvent, useState, useContext } from "react";
import { AuthContext } from "../../../context/Authcontext";
import { db } from "../../../services/firebaseConnection";
import { addDoc, collection } from "firebase/firestore";

const schema = z.object({
    name: z.string().nonempty("O nome é obrigatório"),
    model: z.string().nonempty("O modelo é obrigatório"),
    year: z.string().nonempty("O ano do carro é obrigatório"),
    km: z.string().nonempty("O km do carro é obrigatório"),
    price: z.string().nonempty("O preço é obrigatório"),
    city: z.string().nonempty("A cidade é obrigatória"),
    whatsapp: z.string().min(1, "O telefone é obrigatório").refine((value) => /^(\d{11,12})$/.test(value), {
        message: "Numero de telefone inválido"
    }),
    description: z.string().nonempty("A descrição é obrigatória")
})

type FormData = z.infer<typeof schema>;

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export function New() {
    const {user} = useContext(AuthContext)

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [cloudinaryUrl, setCloudinaryUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

     const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })


    

    async function handleFile(e: ChangeEvent<HTMLInputElement>){
        if(!e.target.files || !e.target.files[0]) return;
            const image = e.target.files[0]

            if(image.type !== 'image/jpeg' && image.type !== 'image/png'){
                alert("Apenas arquivos JPEG ou PNG são permitidos.");
                return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(image));
    setCloudinaryUrl(null);

    setUploading(true);
    const url = await handleUpload(image);
    setCloudinaryUrl(url);
    setUploading(false);

    e.target.value = "";

}

    async function handleUpload(image: File): Promise<string> {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", UPLOAD_PRESET);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            { method: "POST", body: formData }
        );

        const data = await response.json();
        return data.secure_url as string;
    }


    function handleRemoveImg() {
        if(previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null)
        setCloudinaryUrl(null);
    }

    async function onSubmit(data: FormData) {
        if (uploading) {
            alert("Aguarde o upload da imagem ser concluído.");
            return;
        }

        await addDoc(collection(db, "cars"), {
            ...data,
            imageUrl: cloudinaryUrl,
            uid: user?.uid
        })

        reset()
        handleRemoveImg()
    }

    

   
    return (
        <Container>
            <DashboardHeader />


            <div className="w-full bg-white p-3 rounded-lg flex items-center gap-2">
                {previewUrl? (
                    <div className="relative w-48 h-32 rounded-lg overflow-hidden border-2 border-gray-300">
                        <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        />
                        {uploading && (
                            <div className="absolute inset bg-black/50 flex items-center justify center">
                                <span className="text-white text-sm">Enviando</span>
                            </div>
                        )}
                        {!uploading && (
                            <button type="button" onClick={handleRemoveImg} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1">
                                <FiTrash size={12} />
                            </button>
                        )}
                    </div>
                
                ): (
                     <label className="border-2 w-48 h-32 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 hover:bg-gray-50">
                        <FiUpload size={30} color="#000" />
                        <input
                            type="file"
                            accept="image/jpeg, image/png"
                            className="hidden"
                            onChange={handleFile}
                        />
                    </label>
                )}
            </div>
           
        
            <div className="w-full flex flex-col bg-white p-3 rounded-lg sm:flex-row items-center gap-2 mt-2 ">
                <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <p className="mb-2 font-medium">
                            Nome do carro
                        </p>
                        <Input
                            type="text"
                            register={register}
                            name="name"
                            error={errors.name?.message}
                            placeholder="Ex: Onix 1.0..."
                        />
                    </div>

                    <div className="mb-3">
                        <p className="mb-2 font-medium">
                            Modelo do carro
                        </p>
                        <Input
                            type="text"
                            register={register}
                            name="model"
                            error={errors.model?.message}
                            placeholder="Ex: 1.0 flex plus manual..."
                        />
                    </div>

                    <div className="flex w-full mb-3 flex-row items-center gap-4">
                        <div className="w-full">
                            <p className="mb-2 font-medium">
                                Ano
                            </p>
                            <Input
                                type="text"
                                register={register}
                                name="year"
                                error={errors.year?.message}
                                placeholder="Ex: 2020/2020"
                            />
                        </div>
                        <div className="w-full">
                            <p className="mb-2 font-medium">
                                KM rodados
                            </p>
                            <Input
                                type="text"
                                register={register}
                                name="km"
                                error={errors.km?.message}
                                placeholder="Ex: 23.900..."
                            />
                        </div>
                    </div>

                     <div className="flex w-full mb-3 flex-row items-center gap-4">
                        <div className="w-full">
                            <p className="mb-2 font-medium">
                                Telefone / Whatsapp
                            </p>
                            <Input
                                type="text"
                                register={register}
                                name="whatsapp"
                                error={errors.whatsapp?.message}
                                placeholder="Ex: 11999043376"
                            />
                        </div>
                        <div className="w-full">
                            <p className="mb-2 font-medium">
                                Cidade
                            </p>
                            <Input
                                type="text"
                                register={register}
                                name="city"
                                error={errors.city?.message}
                                placeholder="Ex: São Paulo - SP..."
                            />
                        </div>
                    </div>

                     <div className="mb-3">
                        <p className="mb-2 font-medium">
                            Preço
                        </p>
                        <Input
                            type="text"
                            register={register}
                            name="price"
                            error={errors.price?.message}
                            placeholder="Ex: 69.000..."
                        />
                    </div>

                     <div className="mb-3">
                        <p className="mb-2 font-medium">
                            Descrição
                        </p>
                        <textarea 
                            className="rounded-md w-full border-2 h-24 px-2 " 
                            {...register("description")}
                            name="description"
                            id="description"
                            placeholder="Digite a descrição completa sobre o carro"
                        />
                        {errors.description && <p className="mb-1 text-red-500">{errors.description.message}</p>}
                    </div>

                    <button type="submit" className="cursor-pointer bg-zinc-900 rounded-md text-white font-medium h-10 w-full">
                        Cadastrar
                    </button>
                </form>
            </div>
        </Container>
    )
}