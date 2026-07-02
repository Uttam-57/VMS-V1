export const PhotoSection = ({ photoUrl, passData }) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Visitor Photo Card */}
      <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 text-center">
        <h4 className="m-0 mb-3 text-slate-500 text-xs font-bold uppercase tracking-wider">
          Visitor Photo Capture
        </h4>
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="Captured Visitor"
            className="w-full max-h-[260px] object-cover rounded-lg border border-slate-300 shadow-sm"
          />
        ) : (
          <div className="w-full h-[200px] flex items-center justify-center bg-slate-200 rounded-lg text-slate-500 font-medium">
            No Image Captured
          </div>
        )}
      </div>

      {/* Carry With & Visit Area Badges */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="block text-xs font-semibold text-slate-400 mb-2">
            Carry With
          </span>
          <div className="flex flex-wrap gap-1.5">
            {Array.isArray(passData.carryWith) && passData.carryWith.length > 0 ? (
              passData.carryWith.map((item, idx) => (
                <span key={idx} className="text-xs bg-slate-100 text-slate-700 border border-slate-300 px-2 py-1 rounded font-semibold">
                  {item}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-400">None</span>
            )}
          </div>
        </div>

        <div>
          <span className="block text-xs font-semibold text-slate-400 mb-2">
            Allowed Visit Areas
          </span>
          <div className="flex flex-wrap gap-1.5">
            {Array.isArray(passData.visitArea) && passData.visitArea.length > 0 ? (
              passData.visitArea.map((item, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-green-50 text-green-800 border border-green-200 px-2 py-1 rounded font-semibold"
                >
                  {item}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-400">None</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
