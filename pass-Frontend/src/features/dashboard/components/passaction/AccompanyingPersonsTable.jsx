export const AccompanyingPersonsTable = ({ passData, backendHost }) => {
  if (!Array.isArray(passData.persons) || passData.persons.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h3 className="m-0 mb-4 text-slate-800 font-bold text-base border-b border-slate-100 pb-2">
        Accompanying Visitors ({passData.persons.length})
      </h3>

      <div className="overflow-hidden border border-slate-200 rounded-xl bg-white shadow-sm">
        <table className="w-full border-collapse text-sm text-left whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Phone No
              </th>
              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Aadhar Number
              </th>
              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Token
              </th>
              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                Identity File
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {passData.persons.map((person, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-slate-800 font-medium">
                  {person.name || "-"}
                </td>
                <td className="px-4 py-3 text-slate-650">
                  {person.phoneNo || "-"}
                </td>
                <td className="px-4 py-3 text-slate-650">
                  {person.aadharNumber || "-"}
                </td>
                <td className="px-4 py-3 text-slate-650">
                  {person.token || "-"}
                </td>
                <td className="px-4 py-3 text-center">
                  {person.aadharFileUrl ? (
                    <a
                      href={person.aadharFileUrl.startsWith("http") ? person.aadharFileUrl : `${backendHost}${person.aadharFileUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary font-semibold no-underline inline-flex items-center gap-1 hover:underline"
                    >
                      📄 View File
                    </a>
                  ) : (
                    <span className="text-slate-400">No File</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
