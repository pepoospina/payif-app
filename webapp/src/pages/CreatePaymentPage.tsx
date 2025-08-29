import { Box } from "grommet";

import { ViewportPage } from "../app/layout/Viewport";
import { AppButton, AppHeading } from "../ui-components";
import { useTranslation } from "react-i18next";
import { GeneralKeys } from "../i18n/i18n.general";
import { HEADING_MARGIN } from "../app/layout/Viewport";
import { PaymentCreator } from "../app/payment/PaymentCreator";
import { useState } from "react";
import { CreatorKeys } from "../i18n/i18n.creator";
import { AbsoluteRoutes } from "../route.names";
import { BoxCentered } from "../ui-components/BoxCentered";
import { useNavigate } from "react-router-dom";

export const CreatePaymentPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [paymentCreated, setPaymentCreated] = useState<string | null>(null);

  const onCreated = (paymentId: string) => {
    setPaymentCreated(paymentId);
  };

  return (
    <ViewportPage>
      <Box margin={HEADING_MARGIN}>
        <AppHeading level={2}>{t(GeneralKeys.createCustomPack)}</AppHeading>
      </Box>
      {paymentCreated ? (
        <BoxCentered pad={{ vertical: "large" }} gap="medium">
          <AppHeading level={3}>{t(CreatorKeys.recipeCreated)}</AppHeading>
          <AppButton
            primary
            label={t(CreatorKeys.viewRecipe)}
            onClick={() =>
              navigate(AbsoluteRoutes.CreatePayment(paymentCreated))
            }
          ></AppButton>
        </BoxCentered>
      ) : (
        <PaymentCreator
          onCreated={(paymentId) => onCreated(paymentId)}
          onCancel={() => navigate(AbsoluteRoutes.App)}
        ></PaymentCreator>
      )}
    </ViewportPage>
  );
};
