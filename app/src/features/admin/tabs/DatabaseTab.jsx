import Seeder from '../Seeder';
import DataManagementPanel from '../DataManagementPanel';

export default function DatabaseTab() {
  return (
    <div className="h-full overflow-y-auto space-y-6">
      <DataManagementPanel />
      <Seeder />
    </div>
  );
}
