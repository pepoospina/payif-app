import { Box } from "grommet";
import { AppHeading, FormInput } from "../../ui-components";
import { useTranslation } from "react-i18next";
import { CreatorKeys } from "../../i18n/i18n.creator";
import { AppButton } from "../../ui-components";
import { ChangeEvent, useState } from "react";
import { usePersist } from "../../utils/use.persist";
import { useAppFetch } from "../../api/app.fetch";
import { CreatePayment } from "../../shared/types/types.payments";

const key = "paymentCreator";

export const PaymentCreator = (props: {
  onCreated?: (productId: string) => void;
  onCancel?: () => void;
}) => {
  const { t } = useTranslation();

  const appFetch = useAppFetch();
  const [isCreating, setIsCreating] = useState(false);

  const [payment, setPayment, deletePayment] = usePersist<CreatePayment>(
    key,
    null
  );

  const reset = () => {
    deletePayment();
  };

  const canCreate = !!payment;

  const onCreated = (productId: string) => {
    reset();
    props.onCreated?.(productId);
  };

  const onCancel = () => {
    reset();
    props.onCancel?.();
  };

  const createRecipe = () => {
    if (!payment) return;
    setIsCreating(true);

    const createFunc = async () => {
      const result = await appFetch<boolean, CreatePayment>(
        "/payments/create",
        payment
      );
      return result;
    };
    createFunc()
      .catch((e) => {
        console.error(e);
      })
      .then((res) => {
        if (!res) return;
        onCreated(res);
      })
      .finally(() => {
        setIsCreating(false);
      });
  };

  const setProperty = (key: keyof CreatePayment, value: string) => {
    setPayment({ ...payment, [key]: value });
  };

  if (!payment) return <></>;

  return (
    <Box>
      <FormInput
        label={t(CreatorKeys.name)}
        inputProps={{
          placeholder: t(CreatorKeys.name),
          value: payment.payer,
          onChange: (e: ChangeEvent) =>
            setProperty("payer", e.target.value as string),
        }}
      ></FormInput>

      <Box margin={{ top: "large" }}>
        <AppHeading level={3}>{t(CreatorKeys.recipe)}</AppHeading>
      </Box>

      <Box direction="row" gap="small">
        <AppButton
          style={{ flexGrow: 1 }}
          label={t(CreatorKeys.cancel)}
          onClick={() => onCancel()}
        ></AppButton>
        <AppButton
          primary
          style={{ flexGrow: 1 }}
          label={t(CreatorKeys.add)}
          onClick={() => createRecipe()}
          disabled={!canCreate}
          isLoading={isCreating}
        ></AppButton>
      </Box>

      <Box style={{ height: "300px" }}></Box>
    </Box>
  );
};
