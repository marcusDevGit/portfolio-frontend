import { create } from "zustand";

interface ContactFormData {
    name: string;
    email: string;
    message: string;
}
interface ContactStore {
    formData: ContactFormData;
    setFormData: (data: Partial<ContactFormData> | ((prev: ContactFormData) => ContactFormData)) => void;
    resetForm: () => void;
}

const initialData: ContactFormData = {
    name: '',
    email: '',
    message: ''
}

export const useContactStore = create<ContactStore>((set) => ({
    formData: initialData,
    setFormData: (data) =>
        set((state) => ({
            formData: typeof data == 'function'
                ? data(state.formData)
                : { ...state.formData, ...data }
        })),
    resetForm: () => set({ formData: initialData }),
}))