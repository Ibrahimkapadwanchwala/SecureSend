import { useEffect, useState } from "react";
import api from "../services/api";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const { data } = await api.get("/admin/audit-logs");
      setLogs(data.logs);
    } catch (err) {
      console.error("Failed to fetch audit logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const renderMetadata = (metadata) => {
    if (!metadata) return "-";

    try {
      const parsed = typeof metadata === "string"
        ? JSON.parse(metadata)
        : metadata;

      return (
        <pre className="whitespace-pre-wrap text-xs bg-gray-50 p-2 rounded-md overflow-x-auto">
          {JSON.stringify(parsed, null, 2)}
        </pre>
      );
    } catch {
      return metadata;
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-xl sm:text-2xl font-semibold mb-6">
        Audit Logs
      </h1>

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <>
          
          <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
            <table className="min-w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="p-3 text-left">User</th>
                  <th className="p-3 text-left">Action</th>
                  <th className="p-3 text-left">Metadata</th>
                  <th className="p-3 text-left">IP</th>
                  <th className="p-3 text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b">
                    <td className="p-3">{log.user_id ?? "-"}</td>
                    <td className="p-3 font-medium">{log.action}</td>
                    <td className="p-3 text-gray-600">
                      {renderMetadata(log.metadata)}
                    </td>
                    <td className="p-3">{log.ip_address ?? "-"}</td>
                    <td className="p-3">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

     
          <div className="space-y-4 md:hidden">
            {logs.map((log) => (
              <div
                key={log.id}
                className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 space-y-2"
              >
                <div className="flex justify-between text-sm">
                  <span className="font-medium">User</span>
                  <span>{log.user_id ?? "-"}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="font-medium">Action</span>
                  <span>{log.action}</span>
                </div>

                <div>
                  <span className="font-medium text-sm">Metadata</span>
                  <div className="mt-1 text-gray-600 text-xs">
                    {renderMetadata(log.metadata)}
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="font-medium">IP</span>
                  <span>{log.ip_address ?? "-"}</span>
                </div>

                <div className="text-xs text-gray-500">
                  {new Date(log.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AuditLogs;
