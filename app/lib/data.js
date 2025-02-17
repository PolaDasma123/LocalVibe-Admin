import { User, Report } from "./models";
import { connectToDB } from "./utils";

export const fetchUsers = async (q, page) => {

    const regex = new RegExp(q, "i")

    const ITEM_PER_PAGE =  7

try {
    await connectToDB();
    const count = await User.find({
        $or: [{ username: { $regex: regex } }, { name: { $regex: regex } }]
    }).countDocuments();
    
    const users = await User.find({
        $or: [{ username: { $regex: regex } }, { name: { $regex: regex } }]
    })
    .limit(ITEM_PER_PAGE)
    .skip(ITEM_PER_PAGE * (page - 1));
     return { count, users };
    } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch users!");
    }
};


export const fetchReports = async (q, page) => {
    const regex = new RegExp(q, "i");
    const ITEM_PER_PAGE = 5;

    try {
        await connectToDB();
        const count = await Report.find({
            $or: [
                { itemType: { $regex: regex } },
                { reason: { $regex: regex } },
                { content: { $regex: regex } },
                { reportTitle: { $regex: regex } }
            ]
        }).countDocuments();

        const reports = await Report.find({
            $or: [
                { itemType: { $regex: regex } },
                { reason: { $regex: regex } },
                { content: { $regex: regex } },
                { reportTitle: { $regex: regex } }
            ]
        })
        .limit(ITEM_PER_PAGE)
        .skip(ITEM_PER_PAGE * (page - 1));

        console.log("Fetched Reports:", reports); // Debugging output
        return { count, reports };
    } catch (err) {
        console.log("Error fetching reports:", err);
        throw new Error("Failed to fetch reports!");
    }
};

export const fetchUser = async (id) => {
try {
    await connectToDB();
    const user = await User.findById(id);
    return user;
    } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch user!");
    }
};



export const fetchTotalUsers = async () => {
    try {
        await connectToDB();
        const totalAccounts = await User.countDocuments(); // Get total count
        return totalAccounts;
    } catch (err) {
        console.log(err);
        throw new Error("Failed to fetch total users!");
    }
};

export const fetchReport = async (id) => {
    try {
        await connectToDB();
        const report = await Report.findById(id);
        return report;
        } catch (err) {
        console.log(err);
        throw new Error("Failed to fetch Report!");
        }
    };
