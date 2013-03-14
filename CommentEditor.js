/*
Copyright (C) 2013 EllisLab, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
ELLISLAB, INC. BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Except as contained in this notice, the name of EllisLab, Inc. shall not be
used in advertising or otherwise to promote the sale, use or other dealings
in this Software without prior written authorization from EllisLab, Inc.
*/

$.fn.CommentEditor = function(options) {

	var OPT;
		
	OPT = $.extend({
		url: "{exp:comment:ajax_edit_url}",
		comment_body: '.comment_body',
		showEditor: '.edit_link',
		hideEditor: '.cancel_edit',
		saveComment: '.submit_edit',
		closeComment: '.mod_link'
	}, options);
		
	var view_elements = [OPT.comment_body, OPT.showEditor, OPT.closeComment].join(','),
		edit_elements = '.editCommentBox',
		hash = '{XID_HASH}';
		
	return this.each(function() {
		var id = this.id.replace('comment_', ''),
		parent = $(this);
			
		parent.find(OPT.showEditor).click(function() { showEditor(id); return false; });
		parent.find(OPT.hideEditor).click(function() { hideEditor(id); return false; });
		parent.find(OPT.saveComment).click(function() { saveComment(id); return false; });
		parent.find(OPT.closeComment).click(function() { closeComment(id); return false; });
	});

	function showEditor(id) {
		$("#comment_"+id)
			.find(view_elements).hide().end()
			.find(edit_elements).show().end();
	}

	function hideEditor(id) {
		$("#comment_"+id)
			.find(view_elements).show().end()
			.find(edit_elements).hide();
	}

	function closeComment(id) {
		var data = {status: "close", comment_id: id, XID: hash};

		$.post(OPT.url, data, function (res) {
			if (res.error) {
				return $.error('Could not moderate comment.');
			}
			
			hash = res.XID;
			$('input[name=XID]').val(hash);
			$('#comment_' + id).hide();
		});
	}

	function saveComment(id) {
		var content = $("#comment_"+id).find('.editCommentBox'+' textarea').val(),
			data = {comment: content, comment_id: id, XID: hash};
		
		$.post(OPT.url, data, function (res) {
			if (res.error) {
				hideEditor(id);
				return $.error('Could not save comment.');
			}

			hash = res.XID;
			$('input[name=XID]').val(hash);
			$("#comment_"+id).find('.comment_body').html(res.comment);
			hideEditor(id);
		});
	}
};
	

$(function() { $('.comment').CommentEditor(); });