
// const db = require('../config/db');
// const { ObjectId } = require('mongodb');
// const mongoose = require('mongoose');
// const Member = require('../models/Member');


// const collection = require('../config/collections');
// module.exports = {
//     insertMember: async (memberData) => {
//         try {
//             const collectionRef = db.get().collection(collection.MEMBER_COLLECTION);
//             const result = await collectionRef.insertOne(memberData);
//             return result;
//         } catch (err) {
//             throw err;
//         }
//     },

//     getAllMembers: async () => {
//         try {
//             const collectionRef = db.get().collection(collection.MEMBER_COLLECTION);
//             const members = await collectionRef.find({}).toArray();
//             return members;
//         } catch (err) {
//             throw err;
//         }
//     },
//     categorizeMembers: async (memberIds, category) => {
//         try {
//             const collectionRef = db.get().collection(collection.MEMBER_COLLECTION);
            
//             // Ensure memberIds is always an array
//             if (!Array.isArray(memberIds)) {
//                 memberIds = [memberIds];
//             }
    
//             const objectIds = memberIds.map(id => new ObjectId(id));
//             const result = await collectionRef.updateMany(
//                 { _id: { $in: objectIds } },
//                 { $set: { category: category } }
//             );
//             return result;
//         } catch (err) {
//             throw err;
//         }
//     }
//     ,

//     getCategorizedMembers: async () => {
//         try {
//             const collectionRef = db.get().collection(collection.MEMBER_COLLECTION);
//             const members = await collectionRef.aggregate([
//                 { $group: { _id: "$category", members: { $push: "$$ROOT" } } }
//             ]).toArray();
//             return members;
//         } catch (err) {
//             console.error('Error in getCategorizedMembers:', err);
//             throw err;
//         }
//     },
//     getMemberById: async (memberId) => {
//         try {
//             const member = await Member.findById(memberId);
//             return member;
//         } catch (err) {
//             console.error('Error in getMemberById:', err);
//             throw err;
//         }
//     },

//     updateMember: async (memberId, updateData) => {
//         try {
//             const result = await Member.findByIdAndUpdate(memberId, updateData, { new: true });
//             return result;
//         } catch (err) {
//             console.error('Error in updateMember:', err);
//             throw err;
//         }
//     }
// };