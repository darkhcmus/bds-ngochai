// ==================== dashboard Controller ================

adminApp.controller("sectorCtrl", function($rootScope, $scope, $compile, $http, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {
    $rootScope.pageTitle = "Admin - Sector ( Khu vực )";
    $scope.item = {};

    $scope.dtOptions = DTOptionsBuilder
        .newOptions()
        .withFnServerData((sSource, aoData, fnCallback, oSettings) => {
            oSettings.jqXHR = $http.post('/admin/sector/all', {
                aoData
            }).then((data) => {
                fnCallback(data.data);
            });

        })
        .withOption('serverSide', true)
        .withOption('processing', true)
        .withOption('stateSave', true)
        // .withOption('headerCallback', function(header) {
        //     $compile(angular.element(header).contents())($scope);
        // })
        .withOption('bInfo', false)
        .withOption('searching', true)
        .withOption('createdRow', function(row, data, index) {
            $compile(row)($scope); //add this to compile the DOM
        })
        .withPaginationType('full_numbers')
        .withLightColumnFilter({
            '0': { html: 'input', type: 'datetime' },
            '1': { html: 'input', regexp: true, type: 'text', time: 500 },
            '2': { html: 'input', regexp: true, type: 'text', time: 500 },
            '3': { html: 'input', regexp: true, type: 'text' },
            '4': { html: 'input', regexp: true, type: 'text' },
            '5': { html: 'input', regexp: true, type: 'text' },
            '6': { html: 'input', regexp: true, type: 'text' },
        });
    // .withOption('order', [
    //     [1, 'asc'],
    //     [1, 'asc']
    // ])
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('_id').withTitle('_id').notVisible(),
        DTColumnBuilder.newColumn('ID').withTitle('ID'),
        // DTColumnBuilder.newColumn('stt').withTitle('stt'),
        DTColumnBuilder.newColumn('title').withTitle('title'),
        DTColumnBuilder.newColumn('type').withTitle('type'),
        DTColumnBuilder.newColumn('link').withTitle('link'),
        DTColumnBuilder.newColumn('provinceID').withTitle('provinceID'),
        DTColumnBuilder.newColumn('districtID').withTitle('districtID'),
        DTColumnDefBuilder.newColumnDef(0).withTitle('Xử lý').withOption('width', '200px').renderWith(renderAction),
    ];

    function renderAction(data, type, full) {
        $scope.allConfig[full._id] = full;
        var html = "<button class='btn btn-info' ng-click=\"preUpdate(allConfig['" + full._id + "'])\"> " + "Sửa" + "</button>";
        return html;
    }

    $scope.allConfig = [];
    jQuery('.card-footer .btn-danger').hide();
    jQuery('.card-footer .btn-info').hide();

    $scope.submitAddSector = function() {
        jQuery('#loadingModalTitle').html('Loading ....');
        jQuery('#loadingModal').modal('show');
        console.log($scope.item);
        // var params = {
        //     method: 'POST',
        //     url: '/admin/product-type/item',
        //     data: {
        //         groupType: $scope.item.groupType,
        //         value: $scope.item.value,
        //         dataType: $scope.item.dataType
        //     }
        // }
        // submitBackend(params, $http, function(result) {
        //     jQuery('#loadingModalTitle').html(result.mes);
        //     if (result.status) {
        //         setTimeout(() => {
        //             window.location.reload();
        //         }, 1500);
        //     }
        //     console.log(result);
        // })
    }

    $scope.submitUpdateSiteConfig = function() {
        jQuery('#loadingModalTitle').html('Loading ....');
        jQuery('#loadingModal').modal('show');
        var params = {
            method: 'PUT',
            url: '/admin/site-config',
            data: {
                _id: $scope._id,
                key: $scope.configKey,
                value: $scope.configValue,
                type: $scope.configType
            }
        }
        submitBackend(params, $http, function(result) {
            jQuery('#loadingModalTitle').html(result.mes);
            if (result.status) {
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
            console.log(result);
        })
    }

    $scope.preUpdate = function(item) {
        // console.log(item);
        jQuery('.card-footer .btn-danger').show();
        jQuery('.card-footer .btn-info').show();
        jQuery('.card-footer .btn-success').hide();
        $scope._id = item._id;
        $scope.configKey = item.key;
        $scope.configType = item.type;
        $scope.configValue = item.value;
        if (item.type == 'object') $scope.configValue = JSON.stringify(item.value);
    }

    $scope.cancelUpdateSiteConfig = function() {
        $scope.configKey = '';
        $scope.configType = '';
        $scope.configValue = '';
        jQuery('.card-footer .btn-danger').hide();
        jQuery('.card-footer .btn-info').hide();
        jQuery('.card-footer .btn-success').show();
    }

});