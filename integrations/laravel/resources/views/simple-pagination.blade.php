@if($paginator->hasPages())
    <nav class="pagination" aria-label="{{ __('Pagination') }}">
        <ol role="list">
            <li>@if($paginator->onFirstPage())<span aria-disabled="true">{{ __('Previous') }}</span>@else<a href="{{ $paginator->previousPageUrl() }}" rel="prev">{{ __('Previous') }}</a>@endif</li>
            <li>@if($paginator->hasMorePages())<a href="{{ $paginator->nextPageUrl() }}" rel="next">{{ __('Next') }}</a>@else<span aria-disabled="true">{{ __('Next') }}</span>@endif</li>
        </ol>
    </nav>
@endif
