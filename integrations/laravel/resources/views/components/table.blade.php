@props(['caption', 'label' => null])
<div class="table-scroll" tabindex="0" role="region" aria-label="{{ $label ?? $caption }}">
    <table {{ $attributes }}>
        <caption>{{ $caption }}</caption>
        @isset($head)<thead>{{ $head }}</thead>@endisset
        <tbody>{{ $slot }}</tbody>
        @isset($foot)<tfoot>{{ $foot }}</tfoot>@endisset
    </table>
</div>
