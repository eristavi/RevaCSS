<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\WithPagination;
use Livewire\Attributes\Validate;

class ProjectSearch extends Component
{
    use WithPagination;

    #[Validate('string|max:100')]
    public string $search = '';

    public function updatedSearch(): void
    {
        $this->resetPage();
    }

    public function render()
    {
        $projects = auth()->user()->projects()
            ->when($this->search !== '', fn ($query) => $query->where('name', 'like', '%'.$this->search.'%'))
            ->latest('id')->paginate(5);
        return view('livewire.project-search', compact('projects'));
    }
}
