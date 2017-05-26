angular.module('IOne-Production').config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/fam/merchandiserClass', {
        controller: 'MerchandiserClassController',
        templateUrl: 'app/src/app/fam/merchandiserClass/merchandiserClass.html'
    })
}]);

angular.module('IOne-Production').controller('MerchandiserClassController', function ($scope, GroupUserService,PromotionChannelService, CBIGroupEmployeeChanRService, CBIGroupEmployeeClassRService, CBIGroupEmployeeBrandRService, Constant, $mdDialog, $q) {
    $scope.pageOption = {
        sizePerPage: 10,
        currentPage: 0,
        totalPage: 100,
        totalElements: 100
    };

    $scope.detailPageOption = {
        sizePerPage: 10,
        currentPage: 0,
        totalPage: 0,
        totalElements: 0
    };

    $scope.selected = [];

    $scope.menuDisplayOption = {
        '105-delete': {display: true, name: '删除', uuid: 'cbe0e957-4609-47fa-a793-11efebd32d4b'},
        '106-query': {display: true, name: '查询', uuid: '726ad142-73bc-4c0e-8fee-4e4873c266e3'},
        '107-add': {display: true, name: '新增', uuid: 'c5b1baef-8b52-45ee-a055-87f4e88417b7'},
        '108-edit': {display: true, name: '编辑', uuid: 'aca65674-441b-4859-b1ac-bd4297c64d84'},

        '109-detailAdd': {display: true, name: '点击新增', uuid: '6066e123-a635-47fe-a2ad-7a7d700fd9a0'},
        '110-detailEdit': {display: true, name: '编辑', uuid: 'f100f38c-267f-4903-b470-dc8e00ac6c7c'},
        '111-detailDelete': {display: true, name: '删除', uuid: 'fa879963-2aa8-4a1c-b3b8-bf1514f194b0'},

        '205-batchDelete': {display: true, name: '批量刪除', uuid: 'd710408e-fbba-41a6-b340-bd3398b2db15'}
    };

    $scope.getMenuAuthData($scope.RES_UUID_MAP.OCM.PROMOTION.RES_UUID).success(function (data) {
        $scope.menuAuthDataMap = $scope.menuDataMap(data);
    });


    // Check authorization
    $scope.isAuthorized = function (option) {
        if ($scope.menuDisplayOption[option].display &&
            ($scope.menuAuthDataMap[$scope.menuDisplayOption[option].uuid] ||
            $scope.isAdmin() || !$scope.menuDisplayOption[option].uuid)) {
            return true;
        }

        return false;
    };


    $scope.showDeleteMenuItem = function () {
        return $scope.isAuthorized('105-delete');
    };

    $scope.showQueryButton = function () {
        return $scope.isAuthorized('106-query');
    };

    $scope.showAddButton = function () {
        return $scope.isAuthorized('107-add');
    };

    $scope.showEditButton = function () {
        return $scope.isAuthorized('108-edit');
    };


    $scope.showDetailAddButton = function () {
        return $scope.isAuthorized('109-detailAdd');
    };

    $scope.showDetailEditButton = function () {
        return $scope.isAuthorized('110-detailEdit');
    };

    $scope.showDetailDeleteButton = function () {
        return $scope.isAuthorized('111-detailDelete');
    };

    $scope.showBatchMenu = function () {
        return $scope.showBatchConfirmMenuItem() || $scope.showBatchCancelConfirmMenuItem() ||
            $scope.showBatchDisableStatusMenuItem() || $scope.showBatchEnableStatusMenuItem();
    };

    $scope.canEditItem = function (item) {
        if (item !== null && item !== undefined) {
            return true;
        }

        return false;
    };

    $scope.canDeleteItem = function (item) {
        if (item !== null && item !== undefined) {
            return true;
        }

        return false;
    };

    $scope.canDetailAction = function (item) {
        if (item !== null && item !== undefined) {
            return true;
        }
        return false;
    };

    // Batch operations
    $scope.canBatchDelete = function () {
        return $scope.selected.length > 0 ? true : false;
    };

    $scope.listFilterOption = {
        status: Constant.STATUS[0].value,

    };

    $scope.sortByAction = function (field) {
        $scope.sortByField = field;
        $scope.sortType = '';
    };

    $scope.refreshList = function () {
        GroupUserService.getAll($scope.pageOption.sizePerPage, $scope.pageOption.currentPage,$scope.listFilterOption.keyword, RES_UUID_MAP.CBI.MERCHANDISER_CLASS.RES_UUID).success(function (data) {
            $scope.itemList = data.content;
            $scope.pageOption.totalPage = data.totalPages;
            $scope.pageOption.totalElements = data.totalElements;
        });
    };

    $scope.refreshGroupEmployeeChanRelation = function () {
        CBIGroupEmployeeChanRService.getAll($scope.detailPageOption.sizePerPage, $scope.detailPageOption.currentPage, $scope.selectedItem.uuid, RES_UUID_MAP.CBI.MERCHANDISER_CLASS.RES_UUID).success(function (data) {
            $scope.chanDetailItemList = data.content;
        });
    };

    $scope.refreshGroupEmployeeClassRelation = function () {
        CBIGroupEmployeeClassRService.getAll($scope.detailPageOption.sizePerPage, $scope.detailPageOption.currentPage, $scope.selectedItem.uuid, RES_UUID_MAP.CBI.MERCHANDISER_CLASS.RES_UUID).success(function (data) {
            $scope.classDetailItemList = data.content;
        });
    };

    $scope.refreshGroupEmployeeBrandRelation = function () {
        CBIGroupEmployeeBrandRService.getAll($scope.detailPageOption.sizePerPage, $scope.detailPageOption.currentPage, $scope.selectedItem.uuid, RES_UUID_MAP.CBI.MERCHANDISER_CLASS.RES_UUID).success(function (data) {
            $scope.brandDetailItemList = data.content;
        });
    };


    $scope.queryDateFormat = function (date) {
        if (date !== undefined) {
            if (date !== null) {
                var formatDate = new Date(date);
                return moment(formatDate).format('YYYY-MM-DD');
            } else {
                return null;
            }
        } else {
            return null;
        }
    };

    $scope.$watch('listFilterOption', function () {
        $scope.pageOption.currentPage = 0;
        $scope.pageOption.totalPage = 0;
        $scope.pageOption.totalElements = 0;
        $scope.refreshList();
    }, true);

    $scope.queryEnter = function (e) {
        if (e.keyCode === 13) {
            $scope.pageOption.currentPage = 0;
            $scope.pageOption.totalPage = 0;
            $scope.pageOption.totalElements = 0;
            $scope.refreshList();
        }
    };

    $scope.queryAction = function () {
        $scope.refreshList();
    };

    $scope.selectAllFlag = false;

    $scope.showDetailPanelAction = function (item) {
        $scope.selectedItem = item;
        $scope.refreshGroupEmployeeChanRelation(item);
        $scope.refreshGroupEmployeeClassRelation(item);
        $scope.refreshGroupEmployeeBrandRelation(item);
    };

    /**
     * Show advanced search panel which you can add more search condition
     */
    $scope.showAdvancedSearchAction = function () {
        $scope.displayAdvancedSearPanel = !$scope.displayAdvancedSearPanel;
        $scope.selectedItem = null;
    };

    /**
     * Show more panel when clicking the 'show more' on every item
     */
    $scope.toggleMorePanelAction = function (item) {
        item.showMorePanel = !item.showMorePanel;

        if (item.showMorePanel) {
            item.detailList = $scope.subItemList;
        }
    };

    /**
     * Toggle the advanced panel for detail item in the list
     */
    $scope.toggleDetailMorePanelAction = function (detail) {
        detail.showMorePanel = !detail.showMorePanel;
    };

    /**
     * Change status to list all items
     */
    $scope.listItemAction = function () {
        $scope.changeViewStatus(Constant.UI_STATUS.VIEW_UI_STATUS);
    };

    /**
     * Set stauts to 'edit' to edit an object. The panel will be generated automatically.
     */
    $scope.editItemAction = function (source, domain, desc) {
        $scope.changeViewStatus(Constant.UI_STATUS.EDIT_UI_STATUS);
        $scope.status = 'edit';
        $scope.desc = desc;
        $scope.source = source;
        $scope.domain = domain;
        if (domain == 'OCM_PROM_MST') {
            $scope.addItem = source;
            $scope.addItem.startPromotionDate = source.startPromotionDate != null ? new Date(source.startPromotionDate) : '';
            $scope.addItem.endPromotionDate = source.endPromotionDate != null ? new Date(source.endPromotionDate) : '';
            $scope.addItem.startPurchaseDate = source.startPurchaseDate != null ? new Date(source.startPurchaseDate) : '';
            $scope.addItem.endPurchaseDate = source.endPurchaseDate != null ? new Date(source.endPurchaseDate) : '';
        } else {
            $scope.addDetailItem = source;
        }
    };

    /**
     * Add new item which will take the ui to the edit page.
     */
    $scope.preAddItemAction = function (source, domain, desc) {
        $scope.changeViewStatus(Constant.UI_STATUS.EDIT_UI_STATUS);
        $scope.status = 'add';
        $scope.desc = desc;
        $scope.source = source;
        $scope.domain = domain;
        if (domain == 'CBI_BASE_CLASS') {
            // $scope.status = 'addMaster';
            $scope.addItem = {};
        } else if (domain == 'CBI_BASE_CLASS_BRAND_R') {
            // $scope.status = 'addDetail';
            $scope.addDetailItem = {};
        }
    };

    /**
     * Save object according current status and domain.
     */
    $scope.saveItemAction = function () {
        if ($scope.status == 'add') {
            if ($scope.domain == 'CBI_BASE_CLASS') {
                BaseClassService.add($scope.source).success(function (data) {
                    $scope.refreshList();
                    $scope.showInfo("新增成功!");
                    $scope.listItemAction();
                });
            }
        } else if ($scope.status == 'edit') {
            if ($scope.domain == 'CBI_BASE_CLASS') {

                BaseClassService.modify($scope.selectedItem.uuid, $scope.selectedItem).success(function () {
                    $scope.refreshList();
                    $scope.showInfo("修改成功!");
                    $scope.listItemAction();
                    $scope.selectedItem = data;
                });
            }
        }
    };


    /**
     * Delete detail item
     */
//    $scope.deleteDetailAction = function (detail) {
//        $scope.showConfirm('确认删除吗？', '删除后不可恢复。', function () {
//            if ($scope.selectedItem) {
//                BrandRelationsService.delete(detail.uuid).success(function () {
//                    $scope.refreshBrandRelation($scope.selectedItem);
//                    $scope.showInfo("刪除成功!");
//                });
//            }
//        });
//    };


    $scope.selectItemAction = function (event, item) {
        $scope.stopEventPropagation(event);
        var idx = $scope.selected.indexOf(item);
        if (idx > -1) {
            $scope.selected.splice(idx, 1);
        }
        else {
            $scope.selected.push(item);
        }
        $scope.selectItemCount = $scope.selected.length;
        console.log($scope.selected)
    };


    $scope.deleteClickAction = function (event, item) {
        $scope.stopEventPropagation(event);
        $scope.showConfirm('确认删除吗？', '删除后不可恢复。', function () {
            if ($scope.selectedItem) {
                GroupUserService.delete(item.uuid).success(function () {
                    $scope.refreshList();

                    $scope.showInfo("刪除成功!");
                    $scope.selectedItem = null
                });
            }
        });
    };

    $scope.confirmAllClickAction = function (event) {
        if ($scope.selected.length > 0) {
            $scope.showConfirm('确认批量启用吗？', '', function () {
                var promotionUpdateInput = {
                    confirm: '2'
                };
                if ($scope.selected) {
                    var promises = [];
                    angular.forEach($scope.selected, function (item) {
                        var response = GroupUserService.modify(item.uuid, promotionUpdateInput).success(function () {
                        });
                        promises.push(response);
                    });
                    $q.all(promises).then(function () {
                        $scope.showInfo('审核启用成功。');
                        $scope.refreshList();
                        $scope.selectItemCount = 0;
                        $scope.selected = [];
                    });
                }
            });
        }
    };


    $scope.deleteAllClickAction = function (event) {
        $scope.stopEventPropagation(event);
        if ($scope.selected.length > 0) {
            $scope.showConfirm('确认删除吗？', '删除后不可恢复。', function () {
                if ($scope.selected) {
                    var promises = [];
                    angular.forEach($scope.selected, function (item) {
                        var response = GroupUserService.delete(item.uuid).success(function (data) {
                        });
                        promises.push(response);
                    });
                    $q.all(promises).then(function () {
                        $scope.showInfo('删除数据成功。');
                        $scope.refreshList();
                        $scope.selectItemCount = 0;
                    });
                }
            });
        }
    };

    $scope.selectAllAction = function () {
        angular.forEach($scope.itemList, function (item) {
            if ($scope.selectAllFlag) {
                item.selected = true;
            } else {
                item.selected = false;
            }
        })
    };

    $scope.openGroupEmployeeChanRDlg = function () {
        $mdDialog.show({
            controller: 'GroupEmployeeChanRController',
            templateUrl: 'app/src/app/fam/merchandiserClass/addGroupEmployeeChanR.html',
            parent: angular.element(document.body),
            targetEvent: event,
            locals: {}
        }).then(function (dataList) {
            var promises = [];
            for (var i = 0; i < dataList.length; i++) {
                var input = {
                    aamGroupEmployeeUuid: $scope.selectedItem.uuid,
                    ocmBaseChanUuid: dataList[i]
                };
                var response = CBIGroupEmployeeChanRService.add(input).success(function () {
                });
                promises.push(response);
            }
            $q.all(promises).then(function () {
                $scope.refreshGroupEmployeeChanRelation();
                $scope.showInfo('新增成功!');

            })
        });
    };

    $scope.openGroupEmployeeChanRDlg = function () {
        $mdDialog.show({
            controller: 'GroupEmployeeClassRController',
            templateUrl: 'app/src/app/fam/merchandiserClass/addGroupEmployeeClassR.html',
            parent: angular.element(document.body),
            targetEvent: event,
            locals: {}
        }).then(function (dataList) {
            var promises = [];
            for (var i = 0; i < dataList.length; i++) {
                var input = {
                    aamGroupEmployeeUuid: $scope.selectedItem.uuid,
                    ocmBaseClassUuid: dataList[i]
                };
                var response = CBIGroupEmployeeClassRService.add(input).success(function () {
                });
                promises.push(response);
            }
            $q.all(promises).then(function () {
                $scope.refreshGroupEmployeeChanRelation();
                $scope.showInfo('新增成功!');

            })
        });
    };

});

angular.module('IOne-Production').controller('GroupEmployeeChanRController', function ($scope, $q, $mdDialog, ChannelService) {
    $scope.pageOption = {
        sizePerPage: 10,
        currentPage: 0,
        totalPage: 0,
        totalElements: 0
    };

    $scope.refreshData = function () {
        ChannelService.getAll($scope.pageOption.sizePerPage, $scope.pageOption.currentPage,'', '', $scope.searchNo, $scope.searchName, RES_UUID_MAP.CBI.MERCHANDISER_CLASS.RES_UUID).success(function (data) {
            $scope.allData = data.content;
            $scope.pageOption.totalElements = data.totalElements;
            $scope.pageOption.totalPage = data.totalPages;
        });
    };

    $scope.selected = [];
    $scope.addToggle = function (item, selected) {
        var idx = selected.indexOf(item.uuid);
        if (idx > -1) {
            selected.splice(idx, 1);
        }
        else {
            selected.push(item.uuid);
        }
    };

    $scope.exists = function (item, list) {
        return list.indexOf(item.uuid) > -1;
    };

    $scope.refreshData();

    $scope.hideDlg = function () {
        $mdDialog.hide($scope.selected);
    };

    $scope.cancelDlg = function () {
        $mdDialog.cancel();
    };

});


angular.module('IOne-Production').controller('GroupEmployeeClassRController', function ($scope, $q, $mdDialog, ChannelService) {
    $scope.pageOption = {
        sizePerPage: 10,
        currentPage: 0,
        totalPage: 0,
        totalElements: 0
    };

    $scope.refreshData = function () {
        ChannelService.getAll($scope.pageOption.sizePerPage, $scope.pageOption.currentPage,'', '', $scope.searchNo, $scope.searchName, RES_UUID_MAP.CBI.MERCHANDISER_CLASS.RES_UUID).success(function (data) {
            $scope.allData = data.content;
            $scope.pageOption.totalElements = data.totalElements;
            $scope.pageOption.totalPage = data.totalPages;
        });
    };

    $scope.selected = [];
    $scope.addToggle = function (item, selected) {
        var idx = selected.indexOf(item.uuid);
        if (idx > -1) {
            selected.splice(idx, 1);
        }
        else {
            selected.push(item.uuid);
        }
    };

    $scope.exists = function (item, list) {
        return list.indexOf(item.uuid) > -1;
    };

    $scope.refreshData();

    $scope.hideDlg = function () {
        $mdDialog.hide($scope.selected);
    };

    $scope.cancelDlg = function () {
        $mdDialog.cancel();
    };

});