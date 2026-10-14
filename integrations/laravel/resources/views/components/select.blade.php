@props(['name', 'label' => null, 'id' => null, 'value' => null, 'options' => [], 'placeholder' => null, 'hint' => null, 'error' => null, 'errorBag' => 'default', 'useOld' => true])
@php
    $field = new \Reva\Laravel\Support\FieldState($name, $id, $hint, $error, $errorBag, $attributes, $label);
    $selectedValues = $field->value($value, $useOld);
    $selectedValues = array_map([\Reva\Laravel\Support\FieldState::class, 'scalar'], is_array($selectedValues) ? $selectedValues : [$selectedValues]);
@endphp
<div class="form-group">
    @if($label)<label for="{{ $field->id }}">{{ $label }} @if($attributes->get('required'))<small>({{ __('required') }})</small>@endif</label>@endif
    <select {{ $field->control() }}>
        @if($placeholder !== null && !$attributes->get('multiple'))<option value="" @selected(!$field->reactive && in_array('', $selectedValues, true))>{{ $placeholder }}</option>@endif
        @foreach($options as $optionValue => $optionLabel)
            <option value="{{ $optionValue }}" @selected(!$field->reactive && in_array((string) $optionValue, $selectedValues, true))>{{ $optionLabel }}</option>
        @endforeach
        {{ $slot }}
    </select>
    @include('reva::partials.field-messages')
</div>
