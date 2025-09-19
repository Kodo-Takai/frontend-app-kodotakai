 interface HomeProps {
    user: {
      name: string;
    };
  }

  const user: HomeProps['user'] = {
    name: '',
  };
export default function Home() {
 
  const userName = user?.name?.trim() || "Nombre y apellido";

  return (
    <div className="flex max-w-md mx-auto p-6 bg-white justify-center items-center">
      <div className="flex flex-col items-start w-full">
        <h1 className="font-semibold text-md text-left">Hola,</h1>
        <span className="font-extrabold text-2xl text-red-600">
          {userName}
        </span>
      </div>
    </div>
  );
}
