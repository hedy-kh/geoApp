import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../services/firebase.config";
export const fetchLinkedStudent = async (parentStudentId) => {
  if (!parentStudentId) {
    console.warn("No studentId provided");
    return null;
  }

  try {
    const studentsRef = collection(db, "users");
    const q = query(
      studentsRef,
      where("role", "==", "student"),
      where("studentId", "==", parentStudentId)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Get the first matching student
      const studentDoc = querySnapshot.docs[0];
      const studentData = studentDoc.data();

      return {
        id: studentDoc.id,
        fullName: studentData.fullName,
        grade: studentData.grade,
        schoolName: studentData.schoolName,
        email: studentData.email,
        studentId: studentData.studentId,
        birthDate: studentData.birthDate,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching linked student:", error);
    throw error;
  }
};
export const fetchAllLinkedStudents = async (parentStudentId) => {
  if (!parentStudentId) {
    console.warn("No studentId provided");
    return [];
  }

  try {
    const studentsRef = collection(db, "users");
    const q = query(
      studentsRef,
      where("role", "==", "student"),
      where("studentId", "==", parentStudentId)
    );

    const querySnapshot = await getDocs(q);

    const students = [];
    querySnapshot.forEach((doc) => {
      const studentData = doc.data();
      students.push({
        id: doc.id,
        fullName: studentData.fullName,
        grade: studentData.grade,
        schoolName: studentData.schoolName,
        email: studentData.email,
        studentId: studentData.studentId,
        birthDate: studentData.birthDate,
      });
    });

    return students;
  } catch (error) {
    console.error("Error fetching linked students:", error);
    throw error;
  }
};
export const hasLinkedStudents = async (parentStudentId) => {
  if (!parentStudentId) {
    return false;
  }

  try {
    const studentsRef = collection(db, "users");
    const q = query(
      studentsRef,
      where("role", "==", "student"),
      where("studentId", "==", parentStudentId)
    );

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking linked students:", error);
    return false;
  }
};
