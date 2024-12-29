import api from "../utils/api";

const edit = async (id: string, name: string, email: string): Promise<any> => {
  try {
    const response = await api.put(`users/${id}`, {
      name,
      email,
    });

    if (response.status !== 200) {
      throw new Error(`Failed to edit, response: ${response.status}`);
    }
    
    console.log("Edit user response: ", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default {
  edit,
}