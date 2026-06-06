import Navbar from "../../components/layout/Navbar";

const HomePage = () => {
return ( <div> <Navbar />


  <div className="h-[90vh] flex flex-col items-center justify-center">
    <h1 className="text-6xl font-bold mb-6">
      Movie Reservation System
    </h1>

    <p className="text-zinc-400 text-xl">
      Real-time seat booking platform
    </p>
  </div>
</div>


);
};

export default HomePage;
