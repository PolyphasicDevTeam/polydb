function searchTable(){
    var filter, table, tr, td, i;
    filter = $('#tablesearch').val().toUpperCase();
    tr = $('#maindata').children().find('.sched')
    
    for (i = 0; i < tr.length; i++) {
	td = $(tr[i]).children().first();
	if (td) {
	    if (td.html().toUpperCase().indexOf(filter) > -1) {
		$(tr[i]).css('display','')
	    } else {
		$(tr[i]).css('display','none');
	    }
	}
    }
}

$(document).ready(function(){
    $('#maindata').tablesorter();
})
