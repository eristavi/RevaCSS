<x-reva::input name="name" label="Project name" :value="$project?->name" maxlength="100" required />
<x-reva::textarea name="description" label="Description" :value="$project?->description" rows="4" maxlength="2000" />
<x-reva::select name="status" label="Status" :value="$project?->status ?? 'planned'" :options="['planned' => 'Planned', 'active' => 'Active', 'complete' => 'Complete']" required />
