import { FormProvider, useForm } from "react-hook-form";
import ModalData from "@/components/shared/Modal/ModalData";
import FormInputField from "@/components/shared/Form/FormInput/FormInputField";
import useImportantDateForm from "./useImportantDateForm";
import DateTimePicker from "@/components/shared/Form/FormDateTimePicker";

interface ImportantDate {
  isModalOpen: boolean;
  modalClose: () => void;
  modalData: UpdateDate;
}

const ImportantDateFormModal: React.FC<ImportantDate> = ({
  isModalOpen,
  modalClose,
  modalData,
}) => {
  const methods = useForm();
  const { register, errors, onSubmit, control, handleModalClose } =
    useImportantDateForm({ modalClose, modalData });

  return (
    <FormProvider {...methods}>
      <div>
        <ModalData
          isModalOpen={isModalOpen}
          modalTitle={"modalTitle"}
          modalClose={handleModalClose}
          buttons={[
            {
              btnText: "Submit",
              buttonCss: "py-1.5 px-5",
              btnClick: onSubmit,
            },
          ]}
        >
          <div>
            <FormInputField
              id="stateName"
              {...register("importantDateName")}
              error={errors.importantDateName}
              label="Team Name"
              placeholder={"Important Date Name"}
              containerClass="mt-0 tb:mt-0"
              className="text-lg"
              isMandatory={true}
            />
            <div>
              Important Date
              <DateTimePicker control={control} fieldName="importantDate" />
            </div>
            <div>
              <FormInputField
                id="stateName"
                {...register("importantDateRemarks")}
                error={errors.importantDateRemarks}
                label="Team Name"
                placeholder={"Important Date Remarks"}
                containerClass="mt-0 tb:mt-0"
                className="text-lg"
                isMandatory={true}
              />
            </div>
          </div>
        </ModalData>
      </div>
    </FormProvider>
  );
};
export default ImportantDateFormModal;
