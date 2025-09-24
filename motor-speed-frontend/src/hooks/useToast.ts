import { toast } from "sonner";

export const useToast = () => {
  const showToast = {
    success: (title: string, description?: string) => {
      toast.success(title, {
        description,
        duration: 3000,
      });
    },
    
    error: (title: string, description?: string) => {
      toast.error(title, {
        description,
        duration: 4000,
      });
    },
    
    info: (title: string, description?: string) => {
      toast.info(title, {
        description,
        duration: 4000,
      });
    },
    
    warning: (title: string, description?: string) => {
      toast.warning(title, {
        description,
        duration: 3500,
      });
    },
  };

  return showToast;
};

