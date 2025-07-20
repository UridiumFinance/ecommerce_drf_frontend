export interface ComponentProps {
  fullName: string;
  lastNames: string;
  identification: string;
  telephone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  complaint: string;
  selectedApplication: string;
  selectedMethod: string;
}

export async function sendComplaint(props: ComponentProps) {
  const res = await fetch(`/api/complaints/send`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(props),
  });
  const data = await res.json();
  return data;
}
