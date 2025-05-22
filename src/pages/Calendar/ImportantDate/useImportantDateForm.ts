import { useForm } from "react-hook-form";

interface ImportantDate {
  modalData: UpdateDate;
  modalClose: () => void;
}

export default function ImportantDateFormModal({
  modalClose,
  modalData,
}: ImportantDate) {
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm({
    defaultValues: modalData,
  });

  const handleModalClose = () => {
    reset();
    modalClose();
  };

  return {
    handleModalClose,
    register,
    errors,
    onSubmit: handleSubmit,
    control,
  };
}
