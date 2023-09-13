"use client";

import AlertModal from "@/components/modals/AlertModal";
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";

interface OrderFormProps {
  initialData: any;
}

const formSchema = z.object({
  status: z.string().min(1),
});
type OrderFormValues = z.infer<typeof formSchema>;

const status = [
  { label: "New", value: "New" },
  { label: "In progress", value: "In progress" },
  { label: "Done", value: "Done" },
  { label: "Canceled", value: "Canceled" },
];

const OrderForm = ({ initialData }: OrderFormProps) => {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: initialData?.status,
    },
  });
  const title = "Edit order";
  const description = "Edit your client order.";
  const toastMessage = "Order updated.";
  const action = "Save changes";

  const onSubmit = async (data: OrderFormValues) => {
    try {
      setLoading(true);
      await axios.patch(
        `/api/${params.storeid}/orders/${params.orderid}`,
        data
      );
      router.refresh();
      router.push(`/${params.storeid}/orders`);
      toast.success(toastMessage);
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeid}/orders/${params.orderid}`);
      router.refresh();
      toast.success("Order deleted");
      router.push(`/${params.storeid}/orders`);
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => {
              setOpen(true);
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div>
            <p className="mb-4 font-semibold">Products: </p>
            {initialData?.orderItems.map((item: any) => (
              <p key={item.id}>
                {item.product?.refNum}, {item.product?.name},{" "}
                {item.product?.color?.name}, {item.product?.size?.name} x{" "}
                {item.quantity}
              </p>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <p className="font-semibold">
              Firstname:{" "}
              <span className="font-normal">{initialData?.firstname}</span>
            </p>
            <p className="font-semibold">
              Lastname:{" "}
              <span className="font-normal">{initialData?.lastname}</span>
            </p>
            <p className="font-semibold">
              Phone: <span className="font-normal">{initialData?.phone}</span>
            </p>
            <p className="font-semibold">
              Email: <span className="font-normal">{initialData?.email}</span>
            </p>
            <p className="font-semibold">
              Wilaya: <span className="font-normal">{initialData?.wilaya}</span>
            </p>
            <p className="font-semibold">
              Commune:{" "}
              <span className="font-normal">{initialData?.commune}</span>
            </p>
            <p className="font-semibold">
              Adresse:{" "}
              <span className="font-normal">{initialData?.address}</span>
            </p>
            <p className="font-semibold">
              Delivery type:{" "}
              <span className="font-normal">
                {initialData?.deliveryType === 1
                  ? "Home"
                  : initialData?.deliveryType === 2
                  ? "Stop desk"
                  : ""}
              </span>
            </p>
            <p className="font-semibold">
              Note: <span className="font-normal">{initialData?.note}</span>
            </p>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Change status"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {status.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={loading || !form.formState.isDirty}
            className="ml-auto"
            type="submit"
          >
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};

export default OrderForm;
