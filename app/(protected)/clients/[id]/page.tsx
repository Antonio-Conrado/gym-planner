type Props = {
  params: Promise<{ id: number }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  return (
    <>
      <h1 className="text-4xl">cliente con id: {id}</h1>
    </>
  );
}
