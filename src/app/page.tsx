import JobApplicationForm from "@/components/JobApplicationForm";

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-xl mt-10 mb-10">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          ¿Quieres ser parte de nuestro grupo de relatores?
        </h1>
        <h2 className="text-xl font-bold mb-4 text-center text-gray-600">
          Envíanos tu información
        </h2>
        <JobApplicationForm />
      </div>
    </div>
  );
};

export default Home;
