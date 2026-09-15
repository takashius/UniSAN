import React from "react";
import SelectField from "./SelectField";
import { useBanks } from "../../services/bank";
import { useTranslation } from "react-i18next";

interface BankSelectFieldProps {
  selectedBank: string;
  onSelectBank: (bankId: string) => void;
}

const BankSelectField: React.FC<BankSelectFieldProps> = ({
  selectedBank,
  onSelectBank,
}) => {
  const { t } = useTranslation();
  const { data: banks, isLoading } = useBanks();

  return (
    <SelectField
      value={selectedBank}
      placeholder={t("methodsForm.bankPlaceholder")}
      loading={isLoading}
      maxListHeight={220}
      options={(banks ?? []).map((bank) => ({
        value: bank._id,
        label: `(${bank.code}) ${bank.name}`,
      }))}
      onSelect={onSelectBank}
    />
  );
};

export default BankSelectField;
