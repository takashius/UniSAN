import React, { useMemo } from "react";
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
  const options = useMemo(
    () =>
      [...(banks ?? [])]
        .sort((left, right) =>
          String(left.code || "").localeCompare(
            String(right.code || ""),
            undefined,
            {
              numeric: true,
            },
          ),
        )
        .map((bank) => ({
          value: bank._id,
          label: `(${bank.code}) ${bank.name}`,
        })),
    [banks],
  );

  return (
    <SelectField
      value={selectedBank}
      placeholder={t("methodsForm.bankPlaceholder")}
      loading={isLoading}
      maxListHeight={220}
      options={options}
      onSelect={onSelectBank}
    />
  );
};

export default BankSelectField;
