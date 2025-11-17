import { PaymentConcept, PaymentMethod } from "@/app/generated/prisma";
import {
  useActionState,
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
} from "react";
import registerPaymentAction from "../action/registerPayment-action";
import { registerPaymentInitialState } from "../schema/registerPaymentSchema";
import {
  createInitialState,
  status,
} from "@/shared/interfaces/initialStateAction";
import { toast } from "sonner";
import { calculateEndDate } from "@/lib/helpers/calculateEndDate";
import { InitialClient } from "../components/SearchUser";

export default function useRegisterPayment() {
  // local state
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | "">("");
  const [selectedPaymentConcept, setSelectedPaymentConcept] =
    useState<PaymentConcept | null>(null);
  const [paidAmount, setPaidAmount] = useState(0);
  const [selectedClient, setSelectedClient] = useState<InitialClient | null>(
    null
  );

  //form action state
  const registerPaymentWithConcept = registerPaymentAction.bind(
    null,
    selectedPaymentConcept?.concept
  );

  // useActionState handles the form action, loading status, and errors
  const [state, formAction, pending] = useActionState(
    registerPaymentWithConcept,
    createInitialState(registerPaymentInitialState)
  );

  //Reset form fields safely using useEffectEvent after payment is completed
  const resetForm = useEffectEvent(() => {
    setSelectedPaymentConcept(null);
    setSelectedMethod("");
    setPaidAmount(0);
    setStartDate(new Date());
    setSelectedClient(null);
  });

  useEffect(() => {
    if (state.status === status.COMPLETED) {
      toast.success(state.message);
      resetForm();
    }
    if (state.status === status.ERROR) toast.error(state.message);
  }, [state]);

  //compute change amount dynamically
  const changeAmount = useMemo(() => {
    if (!selectedPaymentConcept || !paidAmount) return 0;

    const paid = Number(paidAmount) || 0;
    const conceptAmount = selectedPaymentConcept.amount;

    return paid - conceptAmount;
  }, [paidAmount, selectedPaymentConcept]);

  // Compute end date based on selected concept and start date
  const endDate = useMemo(() => {
    if (startDate && selectedPaymentConcept) {
      return calculateEndDate(startDate, selectedPaymentConcept.concept);
    }
    return undefined;
  }, [startDate, selectedPaymentConcept]);

  return {
    state,
    formAction,
    pending,
    selectedPaymentConcept,
    setSelectedPaymentConcept,
    selectedMethod,
    setSelectedMethod,
    startDate,
    setStartDate,
    endDate,
    paidAmount,
    setPaidAmount,
    selectedClient,
    setSelectedClient,
    changeAmount,
  };
}
