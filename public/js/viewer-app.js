//= require lib/ui-ace/ace.min.js
//= require lib/ui-ace/ui-ace.min.js

(function startViewerApp(angular) {

  var app = angular.module('ViewerApp', ['ui.ace']);

  app.controller('EditorController', function ($scope, $element) {
    $scope.shownSource = $element.find('#source').html();

    function clearSelection() {
      $scope.selection = null;
      $scope.selectedText = null;
    }

    $scope.aceLoaded = function(_editor) {
      console.log('loaded editor', _editor);
      $scope.editor = _editor;

      $scope.editor.on('gutterclick', function (e) {
        console.log('gutter click', e);
      });

      $scope.editor.getSession().selection.on('changeSelection', function (e) {
        var selection = $scope.editor.getSelectionRange();
        if (selection.isEmpty()) {
          clearSelection();
        } else {
          $scope.selection = selection;
          $scope.selectedText = $scope.editor.session.getTextRange($scope.selection);
          console.log('selection changed', $scope.selection.toString());
        }
        if (!$scope.$$phase) {
          $scope.$apply();
        }
      });
    };

    $scope.aceChanged = function(e) {
      // console.log('editor content changed', e);
    };

    $scope.addReviewNote = function addReviewNote() {
      if ($scope.selection) {
        var entered = prompt('Enter review note');
        if (entered) {
          clearSelection();
          $scope.editor.selection.clearSelection();
        }
      }
    };
  });

  angular.bootstrap(document.body, ['ViewerApp']);
}(window.angular));
