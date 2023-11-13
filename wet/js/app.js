<script th:if="${1 < #lists.size(product_data.images)}">

			document.addEventListener('DOMContentLoaded', function() {
				'use strict';

				var ulSliderBig   = document.querySelector('._jSTfH_ulSliderBig');
				var ulSliderSmall = document.querySelector('._jSTfH_ulSliderSmall');

				var ulSliderBig_scroll   = Element_scrollTo_and_onScroll(ulSliderBig  );
				var ulSliderSmall_scroll = Element_scrollTo_and_onScroll(ulSliderSmall);

				function synchronizeScroll_preScroll(from, to, direction) {
					var datasetImageID = ScrollTools_getScrolledVisibleLeftChild(from).getAttribute('data-imageID'); // leave native error

					var scrollToChild = Array.prototype.find.call(to.children, a => a.getAttribute('data-imageID') === datasetImageID);
					scrollToChild = scrollToChild[ direction == 'prev' ? 'previousElementSibling' : direction == 'next' ? 'nextElementSibling' : null ];
					if (!scrollToChild) return false;

					to.scrollTo({
						top: 0,
						left: scrollToChild.getBoundingClientRect().left - to.firstElementChild.getBoundingClientRect().left,
						behavior: 'smooth',
					});

					return scrollToChild;
				}


				{ // ulSliderDots
					var $ulSliderDots_imgPars = $('._jSTfH_ulSliderDots > ul > li[data-imageid]');

					var ulSliderDots_setActiveDot = function(activeDot) {
						$ulSliderDots_imgPars.removeClass('is-active');
						$(activeDot).addClass('is-active');

						return true;
					}

					var ulSliderDots_setActiveDot_fromDatasetImageID = function(datasetImageID) {
						var nextActiveDot = Array.prototype.find.call($ulSliderDots_imgPars, a => a.getAttribute('data-imageID') === datasetImageID);
						return ulSliderDots_setActiveDot(nextActiveDot, $ulSliderDots_imgPars);
					}
					window.ulSliderDots_setActiveDot_fromDatasetImageID = ulSliderDots_setActiveDot_fromDatasetImageID;

					var ulSliderDots_setActiveDot_fromElemOrigin = function(elemOrigin) {
						var datasetImageID = elemOrigin.getAttribute('data-imageID');

						return ulSliderDots_setActiveDot_fromDatasetImageID(datasetImageID);
					}

					var ulSliderDots_setActiveDot_fromOtherScroll = function(otherScroll) {
						var otherScroll_visibleLeftChild = ScrollTools_getScrolledVisibleLeftChild(otherScroll) // if (null) leave native error

						return ulSliderDots_setActiveDot_fromElemOrigin(otherScroll_visibleLeftChild);
					}
				}

				$('._jSTfH-move-prev, ._jSTfH-move-next').on('click', function(e) {
					var direction =
						this.classList.contains('_jSTfH-move-prev') ? 'prev' :
						this.classList.contains('_jSTfH-move-next') ? 'next' :
						null
					;

					if (!synchronizeScroll_preScroll(ulSliderBig, ulSliderSmall, direction)) {
						// if there is no more to Scroll in big scroller
						// then scroll to scroll ends elem

						var scrollTo =
							direction == 'prev' ? ulSliderSmall.firstElementChild :
							direction == 'next' ? ulSliderSmall.lastElementChild  :
							null
						;
						Element_horizontalScrollToChild(ulSliderSmall, scrollTo);
						ulSliderDots_setActiveDot_fromElemOrigin(scrollTo);

						return;
					}
					var scrollingToEl = Element_horizontalScrollOneChild(ulSliderBig, direction);
					ulSliderDots_setActiveDot_fromElemOrigin(scrollingToEl);

					if (_Wf4lT_elevateZoom && _Wf4lT_elevateZoom._last) { // note: if has ._last is used instead of isDesktop
						_Wf4lT_elevateZoom.reinitElem($(scrollingToEl.querySelector('img')));
					}
				});


				// overwrite native prop
				ulSliderBig  .scrollTo = ulSliderBig_scroll  .scrollTo;
				ulSliderSmall.scrollTo = ulSliderSmall_scroll.scrollTo;


				function synchronizeUlScrolls(from, to) {
					var datasetImageID = ScrollTools_getScrolledVisibleLeftChild(from).getAttribute('data-imageID'); // leave native error

					var scrollToChild = Array.prototype.find.call(to.children, a => a.getAttribute('data-imageID') === datasetImageID);
					to.scrollTo({
						top: 0,
						left: scrollToChild.getBoundingClientRect().left - to.firstElementChild.getBoundingClientRect().left,
						behavior: 'smooth',
					});
				}

				// DO: keep the big slider event before/needs to be run first when page risezes and Big slider is locking the small first.
				var ulSliderBig_scroll_onScroll_debouncingTimeout;
				ulSliderBig_scroll.onScroll(e => {
					clearTimeout(ulSliderBig_scroll_onScroll_debouncingTimeout);
					ulSliderBig_scroll_onScroll_debouncingTimeout = setTimeout(_=>{
						synchronizeUlScrolls(ulSliderBig, ulSliderSmall);
						ulSliderDots_setActiveDot_fromOtherScroll(ulSliderBig);
					}, 100);
				});

				var ulSliderSmall_scroll_onScroll_debouncingTimeout;
				ulSliderSmall_scroll.onScroll(e => {
					clearTimeout(ulSliderSmall_scroll_onScroll_debouncingTimeout);
					ulSliderSmall_scroll_onScroll_debouncingTimeout = setTimeout(_=>{


						if (Element_horizontalIToMostRight(ulSliderSmall)) {
							// do not change big image if old big image is still visible in small scroller

						 // from: no auto scroll from small images while current big image is still visible
						 // uses `Element_horizontalIToMostRight` because should be: but only when current big image is not from the most left of the scroll

							var currentBigEl_datasetImageID = ScrollTools_getScrolledVisibleLeftChild(ulSliderBig).getAttribute('data-imageid');
							var currentSmallEl = Array.prototype.find.call(ulSliderSmall.children, a => a.getAttribute('data-imageID') === currentBigEl_datasetImageID);

							if (.1 < ScrollTools_getScrollChildVisibleRatio(currentSmallEl)) return;
						}

						synchronizeUlScrolls(ulSliderSmall, ulSliderBig);
						ulSliderDots_setActiveDot_fromOtherScroll(ulSliderSmall);
					}, 100);
				});

				

			});
		</script>