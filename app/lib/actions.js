import { revalidatePath } from "next/cache";
import { User } from "./models";
import { connectToDB } from "./utils";
import { redirect } from "next/dist/server/api-utils";
import { permanentRedirect } from "next/navigation";
import bcrypt from "bcrypt";

export const addUser = async (formData)=>{
    "use server"
    const {username, email, password, phone, address, isAdmin, isActive} =
    Object.fromEntries(formData);

    try {
        connectToDB();

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        const newUser = new User({
            username, 
            email, 
            password:hashedPassword, 
            phone, 
            address, 
            isAdmin, 
            isActive
        });

        
    await newUser.save(); 
    }catch(err){
        console.log(err)
        throw new Error("failed to create user!");
    }

    revalidatePath("/dashboard/users")
    permanentRedirect("/dashboard/users")
}

export const deleteUser = async (formData)=>{
    "use server"
    const { id } =
    Object.fromEntries(formData);

    try {
    connectToDB();
    await User.findByIdAndDelete(id); 
    }catch(err){
        console.log(err)
        throw new Error("failed to delete user!");
    }

    revalidatePath("/dashboard/users")
    
}

export const updateUser = async (formData) => {
    "use server"
    const {id, username, email, password, phone, address, isAdmin, isActive } = 
    Object.fromEntries(formData);

    try {
        connectToDB();

        const updateFields = {
            username,
            email,
            password,
            phone,
            address,
            isAdmin,
            isActive
        }
        Object.keys(updateFields).forEach(
            (key)=>
                (updateFields[key]==="" || undefined) && delete updateFields[key]
        );

        await User.findByIdAndUpdate(id, updateFields);

    }catch(err){
        console.log(err)
        throw new Error("failed to update user!");
    }

    revalidatePath("/dashboard/users")
    permanentRedirect("/dashboard/users")

}