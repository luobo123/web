(function($, window, document) {

	function fnInvertKeyValues( aIn ){
		var aRet=[];
		for ( var i=0, iLen=aIn.length ; i<iLen ; i++ ){
			aRet[ aIn[i] ] = i;
		}
		return aRet;
	}

	function fnArraySwitch( aArray, iFrom, iTo ){
		var mStore = aArray.splice( iFrom, 1 )[0];
		aArray.splice( iTo, 0, mStore );
	}

	function fnDomSwitch( nParent, iFrom, iTo ){
		var anTags = [];
		for ( var i=0, iLen=nParent.childNodes.length ; i<iLen ; i++ ){
			if ( nParent.childNodes[i].nodeType == 1 ){
				anTags.push( nParent.childNodes[i] );
			}
		}
		var nStore = anTags[ iFrom ];
		if ( iTo !== null ){
			nParent.insertBefore( nStore, anTags[iTo] );
		}else{
			nParent.appendChild( nStore );
		}
	}

$.fn.dataTableExt.oApi.fnColReorder = function ( oSettings, iFrom, iTo ){
	var i, iLen, j, jLen, iCols=oSettings.aoColumns.length, nTrs, oCol;
	
	if ( iFrom == iTo ){
		return;
	}
	
	if ( iFrom < 0 || iFrom >= iCols ){
		this.oApi._fnLog( oSettings, 1, "ColReorder 'from' index is out of bounds: "+iFrom );
		return;
	}
	
	if ( iTo < 0 || iTo >= iCols )
	{
		this.oApi._fnLog( oSettings, 1, "ColReorder 'to' index is out of bounds: "+iTo );
		return;
	}
	
	/*
	 * Calculate the new column array index, so we have a mapping between the old and new
	 */
	var aiMapping = [];
	for ( i=0, iLen=iCols ; i<iLen ; i++ )
	{
		aiMapping[i] = i;
	}
	fnArraySwitch( aiMapping, iFrom, iTo );
	var aiInvertMapping = fnInvertKeyValues( aiMapping );
	
	
	/*
	 * Convert all internal indexing to the new column order indexes
	 */
	/* Sorting */
	for ( i=0, iLen=oSettings.aaSorting.length ; i<iLen ; i++ )
	{
		oSettings.aaSorting[i][0] = aiInvertMapping[ oSettings.aaSorting[i][0] ];
	}
	
	/* Fixed sorting */
	if ( oSettings.aaSortingFixed !== null )
	{
		for ( i=0, iLen=oSettings.aaSortingFixed.length ; i<iLen ; i++ )
		{
			oSettings.aaSortingFixed[i][0] = aiInvertMapping[ oSettings.aaSortingFixed[i][0] ];
		}
	}
	
	/* Data column sorting (the column which the sort for a given column should take place on) */
	for ( i=0, iLen=iCols ; i<iLen ; i++ )
	{
		oCol = oSettings.aoColumns[i];
		for ( j=0, jLen=oCol.aDataSort.length ; j<jLen ; j++ )
		{
			oCol.aDataSort[j] = aiInvertMapping[ oCol.aDataSort[j] ];
		}
	}
	
	/* Update the Get and Set functions for each column */
	for ( i=0, iLen=iCols ; i<iLen ; i++ )
	{
		oCol = oSettings.aoColumns[i];
		if ( typeof oCol.mData == 'number' ) {
			oCol.mData = aiInvertMapping[ oCol.mData ];
			oCol.fnGetData = oSettings.oApi._fnGetObjectDataFn( oCol.mData );
			oCol.fnSetData = oSettings.oApi._fnSetObjectDataFn( oCol.mData );
		}
	}
	
	
	/*
	 * Move the DOM elements
	 */
	if ( oSettings.aoColumns[iFrom].bVisible )
	{
		/* Calculate the current visible index and the point to insert the node before. The insert
		 * before needs to take into account that there might not be an element to insert before,
		 * in which case it will be null, and an appendChild should be used
		 */
		var iVisibleIndex = this.oApi._fnColumnIndexToVisible( oSettings, iFrom );
		var iInsertBeforeIndex = null;
		
		i = iTo < iFrom ? iTo : iTo + 1;
		while ( iInsertBeforeIndex === null && i < iCols )
		{
			iInsertBeforeIndex = this.oApi._fnColumnIndexToVisible( oSettings, i );
			i++;
		}
		
		/* Header */
		nTrs = oSettings.nTHead.getElementsByTagName('tr');
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			fnDomSwitch( nTrs[i], iVisibleIndex, iInsertBeforeIndex );
		}
		
		/* Footer */
		if ( oSettings.nTFoot !== null )
		{
			nTrs = oSettings.nTFoot.getElementsByTagName('tr');
			for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
			{
				fnDomSwitch( nTrs[i], iVisibleIndex, iInsertBeforeIndex );
			}
		}
		
		/* Body */
		for ( i=0, iLen=oSettings.aoData.length ; i<iLen ; i++ )
		{
			if ( oSettings.aoData[i].nTr !== null )
			{
				fnDomSwitch( oSettings.aoData[i].nTr, iVisibleIndex, iInsertBeforeIndex );
			}
		}
	}
	
	
	/* 
	 * Move the internal array elements
	 */
	/* Columns */
	fnArraySwitch( oSettings.aoColumns, iFrom, iTo );
	
	/* Search columns */
	fnArraySwitch( oSettings.aoPreSearchCols, iFrom, iTo );
	
	/* Array array - internal data anodes cache */
	for ( i=0, iLen=oSettings.aoData.length ; i<iLen ; i++ )
	{
		if ( $.isArray( oSettings.aoData[i]._aData ) ) {
		  fnArraySwitch( oSettings.aoData[i]._aData, iFrom, iTo );
		}
		fnArraySwitch( oSettings.aoData[i]._anHidden, iFrom, iTo );
	}
	
	for ( i=0, iLen=oSettings.aoHeader.length ; i<iLen ; i++ ){
		fnArraySwitch( oSettings.aoHeader[i], iFrom, iTo );
	}
	
	if ( oSettings.aoFooter !== null ){
		for ( i=0, iLen=oSettings.aoFooter.length ; i<iLen ; i++ )
		{
			fnArraySwitch( oSettings.aoFooter[i], iFrom, iTo );
		}
	}
	
	
	for ( i=0, iLen=iCols ; i<iLen ; i++ ){
		oSettings.aoColumns[i].aDataSort = [i];
		oSettings.aoColumns[i]._ColReorder_iOrigCol = i;
		$(oSettings.aoColumns[i].nTh).unbind('click');
		this.oApi._fnSortAttachListener( oSettings, oSettings.aoColumns[i].nTh, i );
	}
	
	
	if ( typeof ColVis != 'undefined' ){
		ColVis.fnRebuild( oSettings.oInstance );
	}

	$(oSettings.oInstance).trigger( 'column-reorder', [ oSettings, {
		"iFrom": iFrom,
		"iTo": iTo,
		"aiInvertMapping": aiInvertMapping
	} ] );
	
	if ( typeof oSettings.oInstance._oPluginFixedHeader != 'undefined' ){
		oSettings.oInstance._oPluginFixedHeader.fnUpdate();
	}
};


if ( typeof $.fn.dataTable == "function" &&
     typeof $.fn.dataTableExt.fnVersionCheck == "function" &&
     $.fn.dataTableExt.fnVersionCheck('1.9.3') ){
	$.fn.dataTableExt.aoFeatures.push( {
		"fnInit": function( oDTSettings ) {
			var oTable = oDTSettings.oInstance;
			if ( typeof oTable._oPluginColReorder == 'undefined' ) {
				var opts = typeof oDTSettings.oInit.oColReorder != 'undefined' ? 
					oDTSettings.oInit.oColReorder : {};
				oTable._oPluginColReorder = new ColReorder( oDTSettings, opts );
			} else {
				oTable.oApi._fnLog( oDTSettings, 1, "ColReorder attempted to initialise twice. Ignoring second" );
			}
			return null;
		},
		"cFeature": "R",
		"sFeature": "ColReorder"
	} );
}else{
	alert( "Warning: ColReorder requires DataTables 1.9.3 or greater - www.datatables.net/download");
}

})(jQuery, window, document);