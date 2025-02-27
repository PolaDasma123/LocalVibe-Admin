import { deleteUser } from "@/app/lib/actions"
import { fetchUsers } from "@/app/lib/data"
import Pagination from "@/app/ui/dashboard/pagination/pagination"
import Search from "@/app/ui/dashboard/search/search"
import styles from "@/app/ui/dashboard/users/users.module.css"
import Image from "next/image"
import Link from "next/link"
import { decryptData } from "@/app/utils/encryption"

const Userspage = async ({searchParams}) => {

    const q = searchParams?.q || "";
    const page = searchParams?.page || 1;
    const {count, users} = await fetchUsers(q,page);

  

    
    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <Search placeholder="Search user..." />
                <Link href="/dashboard/users/add">
                <button className={styles.addButton}>Add Admin</button>
                </Link>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Email</td>
                        <td>Created At</td>
                        <td>Status</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => {
                        const decryptedEmail = decryptData(user.email);
                        return (
                            <tr key={user.id}>
                                <td>
                                    <div className={styles.user}>
                                        <Image 
                                            src={user.img || "/noavatar.png" }
                                            alt="" 
                                            width={40} 
                                            height={40} 
                                            className={styles.userImage}
                                        />
                                    {user.name}
                                    </div>
                                </td>
                                <td>{decryptedEmail}</td>
                                <td>{user.createdAt?.toString().slice(4, 16)}</td>
                                <td>{user.isActive ? "Active" : "Passive"}</td>
                                
                                <td>
                                    <div className={styles.buttons}>
                                        <Link href={`/dashboard/users/${user.id}`}>
                                            <button className={`${styles.button} ${styles.view}`}>
                                                View
                                            </button>
                                        </Link>
                                        <form action={deleteUser}>
                                            <input type="hidden" name="id" value={user.id} />
                                            <button className={`${styles.button} ${styles.delete}`}>
                                                Delete
                                            </button>
                                            </form>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <Pagination count = {count} />
        </div>
    );
};

export default Userspage
