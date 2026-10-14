<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Reva\Laravel\Support\Appearance;

class PreferenceController
{
    public function edit(Appearance $appearance)
    {
        $keys = ['theme', 'palette', 'font', 'shape', 'density', 'width', 'motion'];
        // Custom geometry needs custom token CSS; the reference UI offers presets.
        $choices = array_intersect_key($appearance->choices(), array_flip($keys));
        foreach ($choices as &$values) $values = array_values(array_diff($values, ['custom']));
        return view('preferences', compact('choices'));
    }

    public function update(Request $request, Appearance $appearance)
    {
        $rules = [];
        foreach (['theme', 'palette', 'font', 'shape', 'density', 'width', 'motion'] as $key) {
            $rules[$key] = ['required', Rule::in(array_diff($appearance->choices()[$key], ['custom']))];
        }
        $request->user()->update(['preferences' => $request->validate($rules)]);
        return back()->with('status', __('Appearance saved.'));
    }
}
