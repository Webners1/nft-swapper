import Loading from './index';

const FullPageLoading = () => {
  return (
    <div className="fixed top-0 left-0 z-[100] flex h-screen w-full items-center justify-center overflow-hidden bg-slate-400 bg-opacity-60">
      <Loading />
    </div>
  );
};

export default FullPageLoading;
