angular.module('IOne-Production').config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/eps/report/plmBaseItemFile', {
        controller: 'EpsOrderReport_plmBaseItemFile_controller',
        templateUrl: 'app/src/app/eps/report/plmBaseItemFile.html'
    })
}]);
angular.module('IOne-Production').controller('EpsOrderReport_plmBaseItemFile_controller', function ($scope, $filter, EpsOrderReportService) {
    $scope.pageOption = {
        sizePerPage: 10,
        currentPage: 0,
        totalPage: 100,
        totalElements: 100
    };

    var thisMonth = new Date();
    var previousMonth = new Date();
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    $scope.orderDate = {
        from: previousMonth,
        to: thisMonth
    }

    $scope.$watch('orderDate', function () {
        getReportByIsCsvFile(false);
    }, true);


    $scope.report;
    $scope.reportKeys = [];
    function getReportByIsCsvFile(isCsvFile) {
        var orderDateFrom = $filter('date')($scope.orderDate.from, 'yyyy-MM-dd');
        var orderDateTo = $filter('date')($scope.orderDate.to, 'yyyy-MM-dd');
        if (orderDateFrom == null || orderDateFrom == null) {
            $scope.showError("日期不可為空");
            return;
        }
        ;

        if (isCsvFile) {
            EpsOrderReportService.getPlmBaseItemFile_Csvfile(orderDateFrom, orderDateTo).then(function (response) {
                var hiddenElement = document.createElement('a');
                hiddenElement.href = 'data:attachment/csv;charset=utf-8,\uFEFF' + encodeURIComponent(response.data);
                hiddenElement.target = '_blank';
                hiddenElement.download = orderDateFrom + '_' + orderDateTo + '.csv';
                hiddenElement.click();
            }, function (response) {
                $scope.showError(response.message);
            });

        } else {
            EpsOrderReportService.getPlmBaseItemFile(orderDateFrom, orderDateTo, $scope.pageOption).then(function (response) {
                $scope.pageOption.totalPage = response.data.totalPages;
                $scope.pageOption.totalElements = response.data.totalElements;
                $scope.report = response.data;
                if (response.data.content.length == 0)$scope.showInfo("沒有任何資料");

                if ($scope.reportKeys.length == 0) {
                    fetchKeys(response.data.content[0]);
                }

            }, function (response) {
                $scope.showError(response.message);
            });
        }

        function fetchKeys(object) {
            angular.forEach(object, function (value, key) {
                if (key == 'RNUM') {
                    $scope.reportKeys.unshift(key);
                } else {
                    $scope.reportKeys.push(key);
                }
            });
        }
    }

});