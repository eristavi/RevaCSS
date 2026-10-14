<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProjectController
{
    private function data(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:2000'],
            'status' => ['required', Rule::in(['planned', 'active', 'complete'])],
        ]);
    }

    public function index(Request $request)
    {
        return view('projects.index', [
            'projects' => $request->user()->projects()->latest('id')->paginate(5),
            'total' => $request->user()->projects()->count(),
            'active' => $request->user()->projects()->where('status', 'active')->count(),
            'complete' => $request->user()->projects()->where('status', 'complete')->count(),
        ]);
    }

    public function store(Request $request)
    {
        $request->user()->projects()->create($this->data($request));
        return redirect()->route('projects.index')->with('status', __('Project created.'));
    }

    public function edit(Request $request, string $project)
    {
        return view('projects.edit', ['project' => $request->user()->projects()->findOrFail($project)]);
    }

    public function update(Request $request, string $project)
    {
        $record = $request->user()->projects()->findOrFail($project);
        $record->update($this->data($request));
        return redirect()->route('projects.index')->with('status', __('Project updated.'));
    }

    public function destroy(Request $request, string $project)
    {
        $request->user()->projects()->findOrFail($project)->delete();
        return redirect()->route('projects.index')->with('status', __('Project deleted.'));
    }
}
